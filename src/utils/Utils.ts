import MessageEmbed from "../structs/MessageEmbed";
import { MessageOptions } from "../typings";
import { APIMessage, APIUser, APIGuildMember } from "discord-api-types";
import fetch, { Response, BodyInit, HeadersInit } from "node-fetch";
import Message from "../structs/Message";
import Guild from "../structs/Guild";
import Channel from "../structs/Channel";
import User from "../structs/User";
import GuildMember from "../structs/GuildMember";
import Client from "../structs/Client";

export default class Utils extends null {
    public static async request(endpoint: string, method: string, { body, headers }: { body?: BodyInit, headers: HeadersInit }): Promise<Response> {
        return await fetch(`https://discord.com/api/v9${endpoint}`, {
            method, 
            body,
            headers,
        });
    }

    public static transformOptions(x: string | MessageEmbed | MessageOptions): MessageOptions {
        const options: MessageOptions = {};
        if (typeof x === "string") {
            options.content = x;
        } else if (x instanceof MessageEmbed) {
            options.embeds = [x.toJson];
        } else {
            if (x.content) options.content = x.content;
            if (x.embeds) {
                options.embeds = x.embeds.map(
                    (e) => e instanceof MessageEmbed && e.toJson
                );
            }
        }

        return options;
    }

    public static convertAPIMessage(
        message: APIMessage,
        channel: Channel,
        client: Client
    ): Message {
        return new Message(
            message.id,
            channel.guild,
            channel,
            message.content,
            this.convertAPIUser(message.author),
            this.convertAPIMember(message.author, message.member, channel.guild),
            message.timestamp,
            message.edited_timestamp,
            client
        );
    }

    public static convertAPIUser(user: APIUser): User {
        return new User(
            user.id,
            user.username,
            user.discriminator,
            user.avatar,
            user.bot || false
        );
    }

    public static convertAPIMember(
        user: User | APIUser,
        member: APIGuildMember,
        guild: Guild
    ): GuildMember {
        return member ?
            new GuildMember(
                user instanceof User ? user : this.convertAPIUser(user),
                member.nick || null,
                member.roles,
                guild
            ) :
            null;
    }
}