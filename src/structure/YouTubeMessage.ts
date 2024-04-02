import { $Container, $Element } from "fluentx";
import { StyleModel } from "./StyleModel";
import { ROLE_MODEL_MAP } from "../main";
import { AVATAR_FILES } from "../data/avatar";

export interface YouTubeMessageData {
    name: string;
    message: string;
    role: 'Normal' | 'Member' | 'Moderator' | 'Owner';
}
export class YouTubeMessage extends $Container {
    data: YouTubeMessageData;
    $content = $('div').id('content');
    $message = $('span').id('message');
    $name = $('span').id('author-name');
    $author_area = $('yt-live-chat-author-chip');
    $timestamp = $('span').id('timestamp')
    $avatar = $('yt-img-shadow').id('author-photo');
    $overlay = $('div').class('overlay');
    $hint = $('div').class('hint').css({display: 'none'});
    constructor(data: YouTubeMessageData) {
        super('yt-live-chat-text-message-renderer')
        this.data = data;
        this.build();
        this.init();
    }

    init() {
        ROLE_MODEL_MAP.get(this.data.role)?.forEach((model, element) => this.updateStyle(element, model))
    }

    build() {
        this.content([
            this.$overlay.content([
                `Role: ${this.data.role}`
            ]),
            this.$hint,
            this.$avatar.content([
                $('img').src(`/${this.avatar_url}`)
            ]),
            this.$content.content([
                this.$timestamp.content(new Intl.DateTimeFormat('en', {timeStyle: 'short'}).format(new Date())),
                this.$author_area.content([
                    this.$name.content(this.data.name),
                    $('span').id('chat-badges').content([
                        $('yt-live-chat-author-badge-renderer').content([
                            $('div').id('image').content([
                                $('img')
                            ])
                        ]),

                        this.data.role === 'Moderator' ? 
                        $('yt-live-chat-author-badge-renderer').attribute('type', 'moderator').content([
                            $('div').id('image').self($div => {
                                $div.dom.innerHTML = 
                                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M9.64589146,7.05569719 C9.83346524,6.562372 9.93617022,6.02722257 9.93617022,5.46808511 C9.93617022,3.00042984 7.93574038,1 5.46808511,1 C4.90894765,1 4.37379823,1.10270499 3.88047304,1.29027875 L6.95744681,4.36725249 L4.36725255,6.95744681 L1.29027875,3.88047305 C1.10270498,4.37379824 1,4.90894766 1,5.46808511 C1,7.93574038 3.00042984,9.93617022 5.46808511,9.93617022 C6.02722256,9.93617022 6.56237198,9.83346524 7.05569716,9.64589147 L12.4098057,15 L15,12.4098057 L9.64589146,7.05569719 Z"></path></svg>`
                            })
                        ]) : undefined
                    ]),
                ]),
                this.$message.content(this.data.message),
                $('span').id('deleted-state')
            ])
        ])
    }

    updateStyle(element: string, model: StyleModel) {
        switch (element) {
            case 'Message': this.$message.css(model.data); break;
            case 'Name': this.$name.css(model.data); break;
            case 'Avatar': this.$avatar.css(model.data); break;
            case 'Content Area': this.$content.css(model.data); break;
            case 'Author Area': this.$author_area.css(model.data); break;
            case 'Outer Area': this.css(model.data); break;
            case 'Time': this.$timestamp.css(model.data); break;
        }
    }

    hint(element: string) {
        switch (element) {
            case 'Message': this.hintPosition(this.$message); break;
            case 'Name': this.hintPosition(this.$name); break;
            case 'Avatar': this.hintPosition(this.$avatar); break;
            case 'Time': this.hintPosition(this.$timestamp); break;
            case 'Content Area': this.hintPosition(this.$content); break;
            case 'Author Area': this.hintPosition(this.$author_area); break;
            case 'Outer Area': this.hintPosition(this); break;
        }
    }

    private hintPosition($ele: $Element) {
        const rect = $ele.dom.getBoundingClientRect();
        const this_rect = this.dom.getBoundingClientRect();
        this.$hint.css({
            position: 'absolute',
            top: `${rect.top - this_rect.top}px`,
            left: `${rect.left - this_rect.left}px`,
            height: `${rect.height}px`,
            width: `${rect.width}px`,
            backgroundColor: '#ff000030',
            display: 'block'
        })
    }

    private get avatar_url() {
        const array = this.data.role === 'Normal' ? AVATAR_FILES.bocchi
            : this.data.role === 'Member' ? AVATAR_FILES.kita
            : this.data.role === 'Moderator' ? AVATAR_FILES.ryo
            : AVATAR_FILES.nijika;
        
        return array[Math.floor(Math.random() * array.length)]
    }
}