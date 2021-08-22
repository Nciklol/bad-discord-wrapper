import { Snowflake, APIEmbed } from "discord-api-types";
import APIRequestHandler from "../utils/APIRequestHandler";
import Utils from "../utils/Utils";
import Base from "./Base";
import Channel from "./Channel";
import Guild from "./Guild";
import GuildMember from "./GuildMember";
import MessageEmbed from "./MessageEmbed";
import User from "./User";
import Client from "./Client";

export interface ImageURLOptions {
    format?: "webp" | "png" | "jpg" | "jpeg";
    size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
    dynamic?: boolean;
}

export interface MessageOptions {
    content?: string;
    embeds?: MessageEmbed[] | APIEmbed[];
}

export default class Message extends Base {
    public createdTimestamp: number;
    public createdAt: Date;
    public editedTimestamp: number | null = null
    public editedAt: Date | null = null;

    constructor(public id: Snowflake, public guild: Guild, public channel: Channel, public content: string, public author: User, 
        public member: GuildMember, timestamp: string, eTimestamp: string | null, client: Client) {
        super(client);
        this.createdAt = new Date(timestamp);
        this.createdTimestamp = new Date(timestamp).getTime();

        if (eTimestamp) {
            this.editedAt = new Date(eTimestamp);
            this.editedTimestamp = new Date(eTimestamp).getTime();
        }
    }


    public async react(emoji: string): Promise<void> {
        await APIRequestHandler.sendReaction(this.channel.id, this.id, emoji, this.client.ws.token);
    }

    public async edit(content: string | MessageEmbed | MessageOptions): Promise<Message> {
        const message = await APIRequestHandler.editMessage(this.channel.id, this.id, content, this.client.ws.token);
        
        if (!message) return null;
        return Utils.convertAPIMessage(message, this.channel, this.client);
    }
}