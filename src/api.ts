import { Snowflake, APIMessage } from "discord-api-types";
import fetch from "node-fetch"
import MessageEmbed from "./structs/MessageEmbed";
import { MessageOptions } from "./typings";
import Utils from "./utils/Utils";

const ROOT = "https://discord.com/api/v9";
export default class APIRequestHandler {

    public static async sendMessage(channelID: Snowflake, content: string | MessageEmbed | MessageOptions, token: string) {
        const opts = JSON.stringify(Utils.transformOptions(content));
    
        const res = await fetch(`${ROOT}/channels/${channelID}/messages`, {
            method: "POST",
            body: opts,
            headers: {
                Authorization: `Bot ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (res.ok) {
            return await res.json() as APIMessage;
        } else {
            return console.error("DiscordAPIError:", await res.json());
        }
    }

    public static async editMessage(channelID: Snowflake, messageID: Snowflake, content: string | MessageEmbed | MessageOptions, token: string) {
        const opts = JSON.stringify(Utils.transformOptions(content));

        const res = await fetch(`${ROOT}/channels/${channelID}/messages/${messageID}`, {
            method: "PATCH",
            body: opts,
            headers: {
                Authorization: `Bot ${token}`,
                'Content-Type': 'application/json'
            }
        })
        
        if (res.ok) {
            return await res.json() as APIMessage;
        } else {
            return console.error("DiscordAPIError:", await res.json());
        }
    }

    public static async sendReaction(channelID: Snowflake, messageID: Snowflake, emoji: string, token: string) {
        const res = await fetch(`${ROOT}/channels/${channelID}/messages/${messageID}/reactions/${encodeURIComponent(emoji)}/@me`, {
            method: "PUT",
            headers: {
                Authorization: `Bot ${token}`
            }
        })

        if (res.ok) {
            return true;
        } else {
            return console.error("DiscordAPIError:", await res.json());
        }
    }
}