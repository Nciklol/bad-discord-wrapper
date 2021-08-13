import { Snowflake } from "discord-api-types";

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

    public displayAvatarURL() {
        return this._avatarHash ? `https://cdn.discordapp.com/avatars/${this.id}/${this._avatarHash}.png` : `https://cdn.discordapp.com/embed/avatars/${Number(this.discriminator) % 5}.png`
    }

}