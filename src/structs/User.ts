import { Snowflake } from "discord-api-types";
import { ImageURLOptions } from "../typings";

export default class User {
    public tag: string;
    public bot: boolean;
    public avatar: string | null;

    constructor(public id: Snowflake, public username: string, public discriminator: string, private _avatarHash: string, bot: boolean) {
        this.tag = `${username}${this.discriminator}`
        if (!bot) this.bot = false;
        else this.bot = true
        this.avatar = this._avatarHash ? `https://cdn.discordapp.com/avatars/${this.id}/${this._avatarHash}.png` : null;
    }

    public displayAvatarURL({dynamic, size, format}: ImageURLOptions = {}) {
        if (dynamic && this._avatarHash?.startsWith("a_")) format = "gif" as any; 
        return this._avatarHash ? `https://cdn.discordapp.com/avatars/${this.id}/${this._avatarHash}.${format || "webp"}${size ? `?size=${size}` : ""}` 
            : `https://cdn.discordapp.com/embed/avatars/${Number(this.discriminator) % 5}.${format || "webp"}`
    }

}