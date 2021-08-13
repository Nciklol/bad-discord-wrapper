import { Snowflake, APIMessage } from "discord-api-types";
import fetch from "node-fetch"
import MessageEmbed from "./structs/MessageEmbed";
import { MessageOptions } from "./typings";
import Utils from "./utils/Utils";

export default class APIRequestHandler {
    public static async sendMessage(channelID: Snowflake, content: string | MessageEmbed | MessageOptions, token: string) {
        const opts = JSON.stringify(Utils.transformOptions(content));
    
        const res = await fetch(`https://discord.com/api/v9/channels/${channelID}/messages`, {
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
}