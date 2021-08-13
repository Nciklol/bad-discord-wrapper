import { Snowflake, APIGuild} from "discord-api-types";
import handler from "../api";
import { MessageOptions } from "../typings";
import Guild from "./Guild";
import GuildMember from "./GuildMember";
import Message from "./Message";
import MessageEmbed from "./MessageEmbed";
import User from "./User";

export default class Channel {

    constructor(public id: Snowflake, public guild: Guild, public name: string, private _token: string) {};

    public async send(content: string | MessageEmbed | MessageOptions) {
        const msg = await handler.sendMessage(this.id, content, this._token);
        if (!msg) return null;
        
        const user = new User(msg.author.id, msg.author.username, msg.author.discriminator, msg.author.avatar || null, msg.author.bot || false);
        return new Message(msg.id, this.guild, this, msg.content, user, msg.member ? new GuildMember(msg.author.id, msg.member.nick || null, msg.author) : null);
    
    }
}