import { ColorResolvable } from "../typings";
import { APIEmbed } from "discord-api-types";

export default class MessageEmbed {
    private _json = {};

    constructor(embed?: MessageEmbed | APIEmbed) {
        if (embed) {
            embed instanceof MessageEmbed ? this._json = embed._json : this._json = embed;
        }
    }

    public setTitle(title: string) {
        this._json["title"] = title;
        return this;
    }

    public setDescription(description: string) {
        this._json["description"] = description;
        return this;
    }

    public setColor(color: ColorResolvable) {
        this._json['color'] = Colors[color];
        return this;
    }

    public setTimestamp(timestamp?: Date) {
        if (timestamp) this._json['timestamp'] = timestamp.toISOString();
        else this._json['timestamp'] = new Date().toISOString();

        return this;
    }

    public setURL(url: string) {
        this._json['url'] = url;

        return this;
    }

    public setFooter(text: string, iconURL?: string, proxyIconURL?: string) {
        const footer = {text};
        if (iconURL) footer['icon_url'] = iconURL;
        if (proxyIconURL) footer['proxy_icon_url'] = proxyIconURL;
        this._json['footer'] = footer;
        return this;
    }

    get toJson() {
        return this._json;
    }

    get title() {
        return this._json["title"] || null;
    }

    get description() {
        return this._json['description'] || null;
    }

    get color() {
        return this._json['color'] || null;
    }

    get timestamp() {
        return this._json['timestamp'] || null;
    }

    get url() {
        return this._json['url'] || null;
    }
}



const Colors = {
    DEFAULT: 0x000000,
    WHITE: 0xffffff,
    AQUA: 0x1abc9c,
    GREEN: 0x57f287,
    BLUE: 0x3498db,
    YELLOW: 0xfee75c,
    PURPLE: 0x9b59b6,
    LUMINOUS_VIVID_PINK: 0xe91e63,
    FUCHSIA: 0xeb459e,
    GOLD: 0xf1c40f,
    ORANGE: 0xe67e22,
    RED: 0xed4245,
    GREY: 0x95a5a6,
    NAVY: 0x34495e,
    DARK_AQUA: 0x11806a,
    DARK_GREEN: 0x1f8b4c,
    DARK_BLUE: 0x206694,
    DARK_PURPLE: 0x71368a,
    DARK_VIVID_PINK: 0xad1457,
    DARK_GOLD: 0xc27c0e,
    DARK_ORANGE: 0xa84300,
    DARK_RED: 0x992d22,
    DARK_GREY: 0x979c9f,
    DARKER_GREY: 0x7f8c8d,
    LIGHT_GREY: 0xbcc0c0,
    DARK_NAVY: 0x2c3e50,
    BLURPLE: 0x5865f2,
    GREYPLE: 0x99aab5,
    DARK_BUT_NOT_BLACK: 0x2c2f33,
    NOT_QUITE_BLACK: 0x23272a,
};