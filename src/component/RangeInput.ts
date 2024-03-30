import { InputComponent } from "./InputComponent";

export class RangeInput extends InputComponent {
    $range = $('input').type('range').class('range');
    constructor(id: string) {
        super(id);
        this.addStaticClass('range');
        this.$range.id(id);
        this.$value;
        this.layout();
    }

    layout() {
        this.content([
            this.$label,
            $('div').content([
                this.$value,
                this.$range,
                this.$unit
            ])
        ])

        this.$range.on('input', e => {
            this.$value.value(`${this.$range.value()}`)
        })

        this.$value.on('input', e => {
            this.$range.value(this.$value.value())
        })
    }

    value(): string;
    value(value: string | undefined): this;
    value(value?: string) {
        if (!arguments.length) return this.value();
        if (value === undefined) return this;
        if (value.match(/[a-zA-Z]/)) value = value.replaceAll(/[a-zA-Z]/g, '')
        super.value(value);
        this.$range.value(value);
        return this;
    }

    min(number: number) {
        super.min(number);
        this.$range.min(number);
        return this;
    }

    max(number: number) {
        super.max(number);
        this.$range.max(number);
        return this;
    }
}