import { APIEmbed } from "discord-api-types";
import { Colors } from "../utils/Constants";

export default class MessageEmbed {
    private _json = {};

    constructor(embed?: MessageEmbed | APIEmbed) {
        if (embed) {
            embed instanceof MessageEmbed ? this._json = embed._json : this._json = embed;
        }
    }

    public setTitle(title: string): MessageEmbed {
        this._json["title"] = title;
        return this;
    }

    public setDescription(description: string): MessageEmbed {
        this._json["description"] = description;
        return this;
    }

    public setColor(color: ColorResolvable): MessageEmbed {
        this._json['color'] = Colors[color];
        return this;
    }

    public setTimestamp(timestamp?: Date): MessageEmbed {
        if (timestamp) this._json['timestamp'] = timestamp.toISOString();
        else this._json['timestamp'] = new Date().toISOString();

        return this;
    }

    public setURL(url: string): MessageEmbed {
        this._json['url'] = url;
        return this;
    }

    public setImage(url:string): MessageEmbed {
        this._json['image'] = {url};

        return this;
    }

    public setFooter(text: string, iconURL?: string, proxyIconURL?: string): MessageEmbed {
        const footer = {text};
        if (iconURL) footer['icon_url'] = iconURL;
        if (proxyIconURL) footer['proxy_icon_url'] = proxyIconURL;
        this._json['footer'] = footer;
        return this;
    }

    get toJson(): APIEmbed {
        return this._json;
    }

    get title(): string {
        return this._json["title"] || null;
    }

    get description(): string {
        return this._json['description'] || null;
    }

    get color(): string {
        return this._json['color'] || null;
    }

    get timestamp(): string {
        return this._json['timestamp'] || null;
    }

    get url(): string {
        return this._json['url'] || null;
    }
}

export type ColorResolvable =
| 'DEFAULT'
| 'WHITE'
| 'AQUA'
| 'GREEN'
| 'BLUE'
| 'YELLOW'
| 'PURPLE'
| 'LUMINOUS_VIVID_PINK'
| 'FUCHSIA'
| 'GOLD'
| 'ORANGE'
| 'RED'
| 'GREY'
| 'DARKER_GREY'
| 'NAVY'
| 'DARK_AQUA'
| 'DARK_GREEN'
| 'DARK_BLUE'
| 'DARK_PURPLE'
| 'DARK_VIVID_PINK'
| 'DARK_GOLD'
| 'DARK_ORANGE'
| 'DARK_RED'
| 'DARK_GREY'
| 'LIGHT_GREY'
| 'DARK_NAVY'
| 'BLURPLE'
| 'GREYPLE'
| 'DARK_BUT_NOT_BLACK'
| 'NOT_QUITE_BLACK'
| 'RANDOM';