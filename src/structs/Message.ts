import { Snowflake } from "discord-api-types";
import APIRequestHandler from "../api";
import { MessageOptions } from "../typings";
import Utils from "../utils/Utils";
import Base from "./Base";
import Channel from "./Channel";
import Guild from "./Guild";
import GuildMember from "./GuildMember";
import MessageEmbed from "./MessageEmbed";
import User from "./User";

export default class Message extends Base {
    public createdTimestamp: number;
    public createdAt: Date;
    public editedTimestamp: number | null = null
    public editedAt: Date | null = null;

    constructor(public id: Snowflake, public guild: Guild, public channel: Channel, public content: string, public author: User, 
        public member: GuildMember, timestamp: string, eTimestamp: string | null, token: string) {

        super(token);
        this.createdAt = new Date(timestamp);
        this.createdTimestamp = new Date(timestamp).getTime();

        if (eTimestamp) {
            this.editedAt = new Date(eTimestamp);
            this.editedTimestamp = new Date(eTimestamp).getTime();
        }
    }


    public async react(emoji: string) {
        APIRequestHandler.sendReaction(this.channel.id, this.id, emoji, this._token)
    }

    public async edit(content: string | MessageEmbed | MessageOptions) {
        const message = await APIRequestHandler.editMessage(this.channel.id, this.id, content, this._token);
        
        if (!message) return null;
        return Utils.convertAPIMessage(message, this.channel, this._token);
    }
}