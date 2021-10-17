import { Snowflake } from "discord-api-types";
import Channel from "./Channel";
import Guild from "./Guild";
import GuildMember from "./GuildMember";
import Message from "./Message";
import User from "./User";

export default class Reaction {
    public constructor(public channel: Channel, public emoji: Snowflake, public user: User, public guild?: Guild, public member?: GuildMember, public message?: Message,) {
        
    }  
}