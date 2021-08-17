import { Snowflake, APIMessage, APIGuildMember } from "discord-api-types";
import MessageEmbed from "../structs/MessageEmbed";
import { MessageOptions } from "../typings";
import Utils from "./Utils";

export default class APIRequestHandler {
    public static async sendMessage(channelID: Snowflake, content: string | MessageEmbed | MessageOptions, token: string): Promise<APIMessage | void> {
        const opts = JSON.stringify(Utils.transformOptions(content));
        
        const res = await Utils.request(`/channels/${channelID}/messages`, "POST", {
            body: opts,
            headers: {
                "Authorization": `Bot ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            return (await res.json()) as APIMessage;
        } else {
            return console.error("Discord API Error:", await res.json());
        }
    }

    public static async editMessage(channelID: Snowflake, messageID: Snowflake, content: string | MessageEmbed | MessageOptions, token: string): Promise<APIMessage | void> {
        const opts = JSON.stringify(Utils.transformOptions(content));
        
        const res = await Utils.request(`/channels/${channelID}/messages/${messageID}`, "PATCH", {
            body: opts,
            headers: {
                "Authorization": `Bot ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            return (await res.json()) as APIMessage;
        } else {
            return console.error("Discord API Error:", await res.json());
        }
    }

    public static async sendReaction(channelID: Snowflake, messageID: Snowflake, emoji: string, token: string): Promise<true | void> {
        const res = await Utils.request(`/channels/${channelID}/messages/${messageID}/reactions/${encodeURIComponent(emoji)}/@me`, "PUT", {
            headers: {
                "Authorization": `Bot ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            return true;
        } else {
            return console.error("Discord API Error:", await res.json());
        }
    }

    public static async listGuildMembers(guildID: Snowflake, token: string, limit?: number): Promise<APIGuildMember[] | void> {
        const res = await Utils.request(`/guilds/${guildID}/members${limit ? `?limit=${limit}` : ""}`, "GET", {
            headers: {
                "Authorization": `Bot ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            return await res.json() as APIGuildMember[];
        } else {
            return console.error("Discord API Error:", await res.json());
        }
    }
}