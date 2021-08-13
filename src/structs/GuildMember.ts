import { Snowflake, APIUser } from "discord-api-types";
import User from "./User";

export default class GuildMember {
    public id: Snowflake = null;
    public displayName: string = null;


    constructor(public user: User, public nick: string | null) {
        this.id = user.id;
        this.displayName = nick || user.username;
    }
}