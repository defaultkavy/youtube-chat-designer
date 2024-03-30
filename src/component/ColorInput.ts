import { InputComponent } from "./InputComponent";

export class ColorInput extends InputComponent {
    $color = $('input').type('color').class('color');
    constructor(id: string) {
        super(id);
        this.addStaticClass('color');
        this.$color.id(id);
        this.layout();
    }

    layout() {
        this.content([
            this.$label,
            $('div').content([
                this.$value,
                this.$color,
            ])
        ])

        this.$value.on('input', e => this.$color.value(this.$value.value()))
        this.$color.on('input', e => this.$value.value(this.$color.value()))
    }

    value(value: string | undefined) {
        super.value(value);
        this.$color.value(value);
        return this;
    }
}