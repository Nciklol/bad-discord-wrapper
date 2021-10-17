import { Snowflake, APIMessage, APIGuildMember, APIApplicationCommand } from "discord-api-types";
import MessageEmbed from "../structs/MessageEmbed";
import { MessageOptions } from "../structs/Message";
import Utils from "./Utils";
import { APICommand } from "../structs/GuildCommandsManager";

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

        console.log(res.headers);

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

    public static async fetchApplicationCommands(applicationID: Snowflake, token: string): Promise<APIApplicationCommand[] | void> {
        const res = await Utils.request(`/applications/${applicationID}/commands`, "GET", {
            headers: {
                "Authorization": `Bot ${token}`,
                "Content-Type": "application/json"
            }
        });

        const json = await res.json();

        if (res.ok) {
            return json;
        } else {
            return console.error("Discord API Error:", json);
        }
    }

    public static async fetchGuildCommands(applicationID: Snowflake, guildID: Snowflake, token: string): Promise<APIApplicationCommand[] | void> {
        const res = await Utils.request(`/applications/${applicationID}/guilds/${guildID}/commands`, "GET", {
            headers: {
                "Authorization": `Bot ${token}`,
                "Content-Type": "application/json"
            }
        });

        const json = await res.json();

        if (res.ok) {
            return json;
        } else {
            return console.error("Discord API Error:", json);
        }
    }

    public static async respondToInteraction(interactionID: string, interactionToken: string, message: string | MessageEmbed | MessageOptions, token: string): Promise<void> {
        const opts = Utils.transformOptions(message);
        const data = {
            type: 4,
            data: opts
        };

        const res = await Utils.request(`/interactions/${interactionID}/${interactionToken}/callback`, "POST", {
            body: JSON.stringify(data),
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            return;
        } else {
            return console.error("DiscordAPIError:", await res.json());
        }
    }

    public static async deferInteraction(interactionID: string, interactionToken: string, token: string): Promise<void> {
        const data = {
            type: 5
        };

        const res = await Utils.request(`/interactions/${interactionID}/${interactionToken}/callback`, "POST", {
            body: JSON.stringify(data),
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            return;
        } else {
            return console.error("DiscordAPIError:", await res.json());
        }
    }

    public static async editInteraction(interactionToken: string, clientID: string, message: string | MessageEmbed | MessageOptions ): Promise<void> {
        const opts = Utils.transformOptions(message);

        const res = await Utils.request(`/webhooks/${clientID}/${interactionToken}/messages/@original`, "PATCH", {
            body: JSON.stringify(opts),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            return;
        } else {
            return console.error("DiscordAPIError:", await res.json());
        }
    }

    public static async createGuildCommand(data: APICommand, clientID: string, guildID: string, token: string): Promise<APIApplicationCommand | void> {
        const res = await Utils.request(`/applications/${clientID}/guilds/${guildID}/commands`, "POST", {
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot ${token}`
            }
        });

        if (res.ok) {
            return await res.json();
        } else {
            return console.error("DiscordAPIError:", await res.json());
        }
    }
}