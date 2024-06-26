import { $Container, $State } from "fluentx";
import { ColorInput } from "../component/ColorInput";
import { RangeInput } from "../component/RangeInput";
import { SelectInput } from "../component/SelectInput";
import { $chat, ROLE_MODEL_MAP } from "../main";
import { ColorTranslator } from 'colortranslator';
import { $Input } from "fluentx/lib/$Input";
import { firstCap, propCap } from "./util";

export class StylePanel extends $Container {
    type: StyleType;
    name: string;
    flex_hidden$ = $.state(false);
    constructor(name: string, type: StyleType) {
        super('div');
        this.staticClass('style-panel');
        this.type = type;
        this.name = name;
        this.layout();
        this.on('input', e => {
            this.update();
        })
    }

    update() {
        this.role_model_list.forEach(([role, model]) => {
            model.update(this)
            $chat.updateStyle(this.name, model, [role]);
        });
        this.flex_hidden$.set(this.data?.display !== 'flex');
        return this;
    }

    layout() {
        if (!this.roles.length) return this.clear();
        const backgroundColor = this.data.backgroundColor === '??' ? {HEX: '??', A: '??'} : new ColorTranslator(this.data.backgroundColor!);
        const color = this.data.color === '??' ? {HEX: '??', A: '??'} : new ColorTranslator(this.data.color!);
        this.content([
            $('section').content([
                $('h3').content('Properties'),
                $('div').content([
                    new SelectInput('display').label('Display').add([
                        ['block', 'inline', 'flex', 'inline-flex', 'none'].map(value => $('option').content(value).value(value))
                    ]).value(this.data.display),
                    new RangeInput('opacity').value(this.data.opacity).unit('px').min(0).max(1).label('Opacity').self($input => {$input.$range.step(0.01); $input.$value.step(0.1)}),
                    new SelectInput('float').label('Float').add([
                        ['left', 'right', 'none'].map(value => $('option').content(value).value(value))
                    ]).value(this.data.float),
                ])
            ]),

            $('section').content([
                $('h3').content('Flex'),
                $('div').content([
                    new SelectInput('flex-direction').label('Direction').add([
                        ['row', 'column', 'row-reverse', 'column-reverse',].map(value => $('option').content(value).value(value))
                    ]).value(this.data.flexDirection),
                    new RangeInput('gap').value(this.data.gap).unit('px').min(0).max(100).label('Gap'),
                    new SelectInput('justify-content').label('Justify Content').add([
                        ['start', 'center', 'end', 'stretch', 'space-around', 'space-evenly', 'space-between'].map(value => $('option').content(value).value(value))
                    ]).value(this.data.justifyContent),
                    new SelectInput('align-items').label('Align Items').add([
                        ['start', 'center', 'end', 'stretch', 'space-around', 'space-evenly', 'space-between'].map(value => $('option').content(value).value(value))
                    ]).value(this.data.alignItems)
                ])
            ]).hide(this.flex_hidden$),

            this.type === 'text' ? $('section').content([
                $('h3').content('Font'),
                $('div').content([
                    new RangeInput('font-size').value(this.data.fontSize).unit('px').min(1).label('Size'),
                    new RangeInput('font-weight').min(100).max(900).label('Weight').value(this.data.fontWeight).self($input => $input.$range.step(100)),
                    new ColorInput('font-color').value(this.data.color).label('Color'),
                    new RangeInput('font-color-transparent').value(color.A.toString()).unit('px').min(0).max(1).label('Transparent').self($input => {$input.$range.step(0.01); $input.$value.step(0.1)}),
                ])
            ]) : undefined,

            this.type === 'image' ? $('section').content([
                $('h3').content('Dimension'),
                $('div').content([
                    new RangeInput('height').value(this.data.height).unit('px').min(1).label('Height'),
                    new RangeInput('width').value(this.data.width).unit('px').min(1).label('Width'),
                ])
            ]) : undefined,

            $('section').content([
                $('h3').content('Background'),
                $('div').content([
                    new ColorInput('background-color').value(backgroundColor.HEX).label('Color'),
                    new RangeInput('background-color-transparent').value(backgroundColor.A.toString()).unit('px').min(0).max(1).label('Transparent').self($input => {$input.$range.step(0.01); $input.$value.step(0.1)}),
                ])
            ]),
            $('section').content([
                $('h3').content('Padding'),
                $('div').content([
                    ['left', 'top', 'right', 'bottom'].map(dir => new RangeInput(`padding-${dir}`).value(this.data[`padding${firstCap(dir)}`]).unit('px').label(firstCap(dir)))
                ])
            ]),
            $('section').content([
                $('h3').content('Margin'),
                $('div').content([
                    ['left', 'top', 'right', 'bottom'].map(dir => new RangeInput(`margin-${dir}`).value(this.data[`margin${firstCap(dir)}`]).unit('px').label(firstCap(dir)))
                ])
            ]),
            $('section').content([
                $('header').content([
                    $('h3').content('Border'),
                    $('div').content([
                        $('label').content('Link').for('border-link'),
                        $('input').id('border-link').type('checkbox').checked(true)
                    ])
                ]),
                $('div').content([
                ['left', 'top', 'right', 'bottom'].map(dir => 
                    $('section').content([
                        $('h4').content(firstCap(dir)),
                        $('div').content([
                            new RangeInput(`border-${dir}-width`).value(this.data[`border${firstCap(dir)}Width`]).unit('px').label('Width'),
                            new SelectInput(`border-${dir}-style`).label('Style').add([
                                ['solid', 'dashed', 'doubled', 'dotted', 'groove', 'outset', 'inset', 'ridge', 'hidden'].map(value => $('option').value(value).content(value).id(value))
                            ]).value(this.data[`border${firstCap(dir)}Style`]),
                            new ColorInput(`border-${dir}-color`).value(this.data[`border${firstCap(dir)}Color`]).label('Color')
                        ]).on('input', (e, $div) => {
                            if (!$<$Input>(':#border-link')?.checked()) return;
                            ['left', 'top', 'right', 'bottom'].forEach(d => {
                                if (d === dir) return;
                                const id = $(e.target)?.id()
                                if (id?.includes('width')) $<RangeInput>(`:div.border-${d}-width`)?.value($div.$<$Input>(`#border-${dir}-width`)?.value())
                                if (id?.includes('style')) $<SelectInput>(`:div.border-${d}-style`)?.value($div.$<$Input>(`#border-${dir}-style`)?.value())
                                if (id?.includes('color')) $<ColorInput>(`:div.border-${d}-color`)?.value($div.$<$Input>(`#border-${dir}-color`)?.value())
                            })
                        })
                    ])),
                ]),
            ]),
            $('section').content([
                $('header').content([
                    $('h3').content('Border Radius'),
                    $('div').content([
                        $('label').content('Link').for('border-radius-link'),
                        $('input').id('border-radius-link').type('checkbox').checked(true)
                    ])
                ]),
                $('div').content([
                    ['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => 
                        new RangeInput(`border-${corner}-radius`).value(this.data[`border${propCap(corner)}Radius`]).unit('px').label(`${corner.split('-').map(str => str.charAt(0).toUpperCase() + str.slice(1)).toString().replace(',', ' ')}`) 
                        .on('input', (e, $range) => {
                            if (!$<$Input>(':#border-radius-link')?.checked()) return;
                            ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(d => {
                                if (d === corner) return;
                                $<RangeInput>(`:div.border-${d}-radius`)?.value($range.value())
                            })
                        })
                    )
                ])
                    
            ]),
        ])
    }

    get models() {
        return this.roles.map(role => ROLE_MODEL_MAP.get(role)!.get(this.name)!);
    }

    get role_model_list() {
        return this.roles.map(role => [role, ROLE_MODEL_MAP.get(role)!.get(this.name)!] as const);
    }

    get data() {
        if (this.roles.length > 1) {
            function multidata<T extends Object>(object: T, list: T[]) {
                let data = {};
                for (const [key, value] of Object.entries(object)) {
                    data[key] = value;
                    for (const model of list) {
                        if (model[key] !== value) {
                            data[key] = '??';
                            break;
                        }
                    }
                }
                return data;
            }
            return multidata(this.models[0].data, this.models.map(model => model.data)) as Partial<CSSStyleDeclaration>
        } else return this.models[0].data
    }

    get roles() {
        return $<$Input>('::.role-checkbox').map($input => {
            if ($input.checked()) return $input.value();
        }).detype()
    }
}

export type StyleType = 'text' | 'element' | 'image'