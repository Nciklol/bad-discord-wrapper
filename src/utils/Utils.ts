import MessageEmbed from "../structs/MessageEmbed";
import { MessageOptions } from "../typings";
import { APIMessage, APIUser, APIGuildMember } from "discord-api-types";
import Message from "../structs/Message";
import Guild from "../structs/Guild";
import Channel from "../structs/Channel";
import User from "../structs/User";
import GuildMember from "../structs/GuildMember";

export default class Utils extends null {
    
    public static transformOptions(x: string | MessageEmbed | MessageOptions) {
        let options: MessageOptions = {};
        if (typeof x === "string") {
            options.content = x;
        } else if (x instanceof MessageEmbed) {
            options.embeds = [x.toJson]
        } else {
            if (x.content) options.content = x.content;
            if (x.embeds) options.embeds = x.embeds.map(e => e instanceof MessageEmbed ? e.toJson : e);
        }

        return options;
    }

    public static convertAPIMessage(message: APIMessage, channel: Channel) {
        return new Message(message.id, channel.guild, channel, message.content, 
            this.convertAPIUser(message.author), this.convertAPIMember(message.author, message.member));
    }

    public static convertAPIUser(user: APIUser) {
        return new User(user.id, user.username, user.discriminator, user.avatar, user.bot);
    }

    public static convertAPIMember(user: User | APIUser, member: APIGuildMember) {
        return member ? new GuildMember(user instanceof User ? user : this.convertAPIUser(user), member.nick || null) : null;
    }
}