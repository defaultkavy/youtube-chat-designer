import type { $SelectContentType } from "fluentx";
import { InputComponent } from "./InputComponent";

export class SelectInput extends InputComponent {
    $select = $('select');
    constructor(id: string) {
        super(id);
        this.addStaticClass('select');
        this.$select.id(id);
        this.layout();
    }

    layout() {
        this.content([
            this.$label,
            this.$select
        ])
    }


    add(option: $SelectContentType | OrMatrix<$SelectContentType>) {
        this.$select.add(option);
        return this;
    }

    value(value: string | undefined) {
        super.value(value);
        this.$select.value(value);
        return this;
    }
}