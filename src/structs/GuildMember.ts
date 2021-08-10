import { Snowflake, APIUser } from "discord-api-types";
import User from "./User";

export default class GuildMember {
    public user: User = null;
    public displayName: string = null;

    constructor(public id: Snowflake, public nick: string | null, user: APIUser) {
        this.user = new User(user.id, user.username, user.discriminator, user.avatar, user.bot);
        this.displayName = nick || user.username;
    }
}