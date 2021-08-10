import { Snowflake } from "discord-api-types";
import Channel from "./Channel";
import Guild from "./Guild";
import GuildMember from "./GuildMember";
import User from "./User";

export default class Message {
    constructor(public id: Snowflake, public guild: Guild, public channel: Channel, public content: string, public author: User, public member: GuildMember) {}
}