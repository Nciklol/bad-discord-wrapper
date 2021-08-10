import { Snowflake, APIGuild} from "discord-api-types"
import Channel from "./Channel";
import Collection from "@discordjs/collection";

export default class Guild {
    constructor(public id: Snowflake, public channels: Collection<Snowflake, Channel>, public name: string) {}
}