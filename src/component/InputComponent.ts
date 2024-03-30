import { $Container } from "fluentx";

export class InputComponent extends $Container {
    $value = $('input').class('value');
    $unit = $('span').staticClass('unit');
    $label = $('label').hide(true);
    constructor(id: string) {
        super('div');
        this.staticClass('input-component', id);
        this.$value.id(id);
        this.$label.for(id);
    }

    unit(unit: string) {
        this.$unit.content(unit);
        return this;
    }

    value(number: number | string | undefined) {
        if (number === undefined) return this;
        this.$value.value(number.toString());
        return this;
    }

    label(label: string) {
        if (label) this.$label.hide(false);
        this.$label.content(label);
        return this;
    }

    min(number: number) {
        this.$value.min(number);
        return this;
    }

    max(number: number) {
        this.$value.max(number);
        return this;
    }
}