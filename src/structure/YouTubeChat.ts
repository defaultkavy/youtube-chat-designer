import { $Container } from "fluentx";
import { YouTubeMessage, type YouTubeMessageData } from "./YouTubeMessage";
import { StyleModel } from "./StyleModel";
import { $Input } from "fluentx/lib/$Input";

export class YouTubeChat extends $Container {
    messageList = new Set<YouTubeMessage>();
    constructor() {
        super('ytchat')
    }

    send(data: YouTubeMessageData) {
        const message = new YouTubeMessage(data);
        this.messageList.add(message);
        this.insert(message);
        return this;
    }

    updateStyle(element: string, model: StyleModel, roles: string[]) {
        this.messageList.forEach(message => {
            if (roles.includes(message.data.role)) message.updateStyle(element, model);
        })
    }

    showHint(element: string) {
        this.messageList.forEach(message => {
            if (this.roles.includes(message.data.role)) message.hint(element);
        })
    }

    hideHint() {
        this.messageList.forEach(message => {
            message.$hint.css({display: 'none'})
        })
    }

    get roles() {
        return $<$Input>('::.role-checkbox').map($input => {
            if ($input.checked()) return $input.value();
        }).detype()
    }
}