import { $Input } from "fluentx/lib/$Input";
import { StylePanel } from "./StylePanel";
import { ColorTranslator } from "colortranslator";
import { $Select } from "fluentx";
import { firstCap } from "./util";

export class StyleModel {
    data: Partial<CSSStyleDeclaration>;
    constructor(data: Partial<CSSStyleDeclaration>) {
        this.data = data;
    }

    update(panel: StylePanel) {
        const filterMultitype = (value: string | undefined, recover: any, unit = false) => {
            if (value === '??' || value === undefined) {
                return recover;
            } else {
                if (unit) return value + 'px';
                return value;
            }
        }
        const border = (dir: 'top' | 'right' | 'left' | 'bottom') => {
            return {
                [`border${firstCap(dir)}Style`]: filterMultitype(panel.$<$Select>(`#border-${dir}-style`)?.value(), this.data[`boder${firstCap(dir)}Style`]),
                [`border${firstCap(dir)}Color`]: filterMultitype(panel.$<$Input>(`#border-${dir}-color`)?.value(), this.data[`boder${firstCap(dir)}Color`]),
                [`border${firstCap(dir)}Width`]: filterMultitype(panel.$<$Input>(`#border-${dir}-width`)?.value(), this.data[`boder${firstCap(dir)}Color`], true)
            }
        }

        const dir = (prop: 'margin' | 'padding') => {
            return {
                [`${prop}Top`]: filterMultitype(panel.$<$Input>(`#${prop}-top`)?.value(), this.data[`${prop}Top`], true),
                [`${prop}Bottom`]: filterMultitype(panel.$<$Input>(`#${prop}-bottom`)?.value(), this.data[`${prop}Bottom`], true),
                [`${prop}Left`]: filterMultitype(panel.$<$Input>(`#${prop}-left`)?.value(), this.data[`${prop}Left`], true),
                [`${prop}Right`]: filterMultitype(panel.$<$Input>(`#${prop}-right`)?.value(), this.data[`${prop}Right`], true),
            }
        }
        const data: Partial<CSSStyleDeclaration> = {
            fontSize: filterMultitype(panel.$<$Input>('#font-size')?.value(), this.data.fontSize, true),
            fontWeight: filterMultitype(panel.$<$Input>('#font-weight')?.value(), this.data.fontWeight),
            color: 
                new ColorTranslator({
                    ...new ColorTranslator(filterMultitype(panel.$<$Input>('#font-color')?.value(), this.data.color)).RGBObject, 
                    A: filterMultitype(panel.$<$Input>('#font-color-transparent')?.value(), new ColorTranslator(this.data.color!).A)
                }).HEXA,
            backgroundColor: 
                new ColorTranslator({
                    ...new ColorTranslator(filterMultitype(panel.$<$Input>('#background-color')?.value(), this.data.backgroundColor)).RGBObject, 
                    A: filterMultitype(panel.$<$Input>('#background-color-transparent')?.value(), new ColorTranslator(this.data.backgroundColor!).A)
                }).HEXA,
            ...border('top'),
            ...border('bottom'),
            ...border('left'),
            ...border('right'),
            borderTopLeftRadius: filterMultitype(panel.$<$Input>('#border-top-left-radius')?.value(), this.data.borderTopLeftRadius, true),
            borderTopRightRadius: filterMultitype(panel.$<$Input>('#border-top-right-radius')?.value(), this.data.borderTopRightRadius, true),
            borderBottomLeftRadius: filterMultitype(panel.$<$Input>('#border-bottom-left-radius')?.value(), this.data.borderBottomLeftRadius, true),
            borderBottomRightRadius: filterMultitype(panel.$<$Input>('#border-bottom-right-radius')?.value(), this.data.borderBottomRightRadius, true),
            ...dir('margin'),
            ...dir('padding'),
            opacity: filterMultitype(panel.$<$Input>('#opacity')?.value(), this.data.opacity),
            display: filterMultitype(panel.$<$Select>('#display')?.value(), this.data.display),
            height: filterMultitype(panel.$<$Input>('#height')?.value(), this.data.height, true),
            width: filterMultitype(panel.$<$Input>('#width')?.value(), this.data.width, true),
        }
        this.data = data;
        return this;
    }

    cssObject() {
        const json = {};
        const convert = (passKey: string | null, data: Object) => {
            for (let [key, value] of Object.entries(data)) {
                key = passKey ? passKey + key.charAt(0).toUpperCase() + key.slice(1) : key;
                if (value instanceof Object === false) {
                    if (typeof value === 'number' && key !== 'opacity') value = `${value}px`;
                    Object.assign(json, {[`${key}`]: value});
                    continue;
                }
                convert(key, value);
            }
        }
        convert(null, this.data);
        return json
    }

    css() {
        
    }
}