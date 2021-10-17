import MessageEmbed from "../structs/MessageEmbed";
import { MessageOptions } from "../structs/Message";
import { APIMessage, APIUser, APIGuildMember, APIInteraction, InteractionType, APIEmoji } from "discord-api-types";
import fetch, { Response, BodyInit, HeadersInit } from "node-fetch";
import Message from "../structs/Message";
import Guild from "../structs/Guild";
import Channel from "../structs/Channel";
import User from "../structs/User";
import GuildMember from "../structs/GuildMember";
import Client from "../structs/Client";
import Interaction from "../structs/Interaction";
import CommandInteraction from "../structs/CommandInteraction";
import Reaction from "../structs/Reaction";


interface MessageReactionAdd {
    // eslint-disable-next-line camelcase  -- complaining about api docs
    user_id: string;
    // eslint-disable-next-line camelcase  -- complaining about api docs
    channel_id: string;
    // eslint-disable-next-line camelcase  -- complaining about api docs
    message_id: string;
    // eslint-disable-next-line camelcase  -- complaining about api docs
    guild_id?: string;
    member?: APIGuildMember;
    emoji: APIEmoji;
}

export default class Utils extends null {
    public static async request(endpoint: string, method: string, { body, headers }: { body?: BodyInit, headers?: HeadersInit }): Promise<Response> {
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
            this.convertAPIMember(message.author, message.member, channel.guild, client),
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
        guild: Guild,
        client: Client
    ): GuildMember {
        return member ?
            new GuildMember(
                user instanceof User ? user : this.convertAPIUser(user),
                member.nick || null,
                member.roles,
                guild,
                client
            ) :
            null;
    }

    public static convertAPIInteraction(interaction: APIInteraction, client: Client): Interaction {
        if (interaction.member) {
            const guild = client.guilds.get(interaction.guild_id);
            const member = Utils.convertAPIMember(interaction.member.user, interaction.member, guild, client);
            
            if (interaction.type === InteractionType.ApplicationCommand) {
                return new CommandInteraction(client, interaction.data, interaction.id, interaction.token, interaction.type, member);
            }
        } else {
            return new Interaction(client, interaction.type);
        }
    }

    public static convertAPIReaction(reaction: MessageReactionAdd, client: Client): Reaction {
        const user = this.convertAPIUser(reaction.member.user);
        const guild = client.guilds.get(reaction.guild_id) || null;
        const member = reaction.member ? this.convertAPIMember(user, reaction.member, guild, client) : null;

        return new Reaction(guild?.channels.get(reaction.channel_id), 
            reaction.emoji.id, user, guild, member, client.messages.get(reaction.channel_id).get(reaction.message_id));
    }
}