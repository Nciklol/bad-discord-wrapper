import Client from "./Client";
import type { APIApplicationCommandInteractionData, APIApplicationCommandInteractionDataOption, Snowflake, APIGuildMember } from "discord-api-types";
import { MessageEmbed } from "..";
import APIRequestHandler from "../utils/APIRequestHandler";
import { MessageOptions } from "./Message";
import Interaction from "./Interaction";
import GuildMember from "./GuildMember";

export default class CommandInteraction extends Interaction {
    public name: string;
    public readonly id: Snowflake;
    public options: APIApplicationCommandInteractionDataOption[];

    private readonly _id: Snowflake;
    private readonly _token: Snowflake;
    private _responded = false;

    public constructor(client: Client, data: APIApplicationCommandInteractionData, id: Snowflake, token: Snowflake, type: number, public member: GuildMember | APIGuildMember) {
        super(client, type);
        this.options = data.options || [];
        this.name = data.name;
        this.id = data.id;
        this._id = id;
        this._token = token;
    }

    public async reply(message: string | MessageEmbed | MessageOptions): Promise<void> {
        if (this._responded) {
            return await APIRequestHandler.editInteraction(this._token, this.client.user.id, message);
        }
        this._responded = true;
        return await APIRequestHandler.respondToInteraction(this._id, this._token, message, this.client.ws.token);
    }

    public async defer(): Promise<void> {
        this._responded = true;
        return await APIRequestHandler.deferInteraction(this._id, this._token, this.client.ws.token);
    }
}