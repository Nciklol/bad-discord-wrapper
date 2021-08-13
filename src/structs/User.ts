import { Snowflake } from "discord-api-types";

export default class User {
    public tag: string;
    public bot: boolean;

    constructor(public id: Snowflake, public username: string, public discriminator: string, public avatarHash: string, bot: boolean) {
        this.tag = `${username}#${discriminator}`
        if (!bot) this.bot = false;
        else this.bot = true
    }

    public displayAvatarURL() {
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatarHash}.png`
    }

}