import { Snowflake } from "discord-api-types";

export interface ImageURLOptions {
    format?: "webp" | "png" | "jpg" | "jpeg";
    size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
    dynamic?: boolean;
}

export default class User {
    public tag: string;
    public bot: boolean;
    public avatar: string | null;

    constructor(public id: Snowflake, public username: string, public discriminator: string, private _avatarHash: string, bot: boolean) {
        this.tag = `${username}#${this.discriminator}`;
        if (!bot) this.bot = false;
        else this.bot = true;
        this.avatar = this._avatarHash ? `https://cdn.discordapp.com/avatars/${this.id}/${this._avatarHash}.png` : null;
    }

    public displayAvatarURL({dynamic, size, format}: ImageURLOptions = {}): string {
        let type: string = format;

        if (dynamic && this._avatarHash?.startsWith("a_")) type = "gif"; 
        return this._avatarHash ? `https://cdn.discordapp.com/avatars/${this.id}/${this._avatarHash}.${type || "webp"}${size ? `?size=${size}` : ""}` : 
            `https://cdn.discordapp.com/embed/avatars/${Number(this.discriminator) % 5}.${type || "webp"}${size ? `?size=${size}` : ""}`;
    }

    public toString(): string {
        return `<@${this.id}>`;
    }

    public valueOf(): Snowflake {
        return this.id;
    }
}