import { Snowflake } from "discord-api-types";
import fetch from "node-fetch"

export async function sendMessage(channelID: Snowflake, content: string, token: string) {
    await fetch(`https://discord.com/api/v9/channels/${channelID}/messages`, {
        method: "POST",
        body: JSON.stringify({content}),
        headers: {
            Authorization: `Bot ${token}`,
            'Content-Type': 'application/json'
        }
    })
}