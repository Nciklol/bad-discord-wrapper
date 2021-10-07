import Guild from "./Guild";
import GuildMember from "./GuildMember";
import User from "./User";
import { APIApplicationCommandInteractionData, APIMessageComponentInteractionData, Snowflake, APIApplicationCommandInteractionDataOption } from "discord-api-types";
import APIRequestHandler from "../utils/APIRequestHandler";
import Client from "./Client";
import Base from "./Base";
import { MessageOptions } from "./Message";
import MessageEmbed from "./MessageEmbed";

export default class Interaction extends Base {
    public name: string;
    public options: APIApplicationCommandInteractionDataOption[];
    private _id: string;
    private _responded: boolean;

    constructor(private readonly _token: string, public user: User, id: Snowflake, data: APIApplicationCommandInteractionData | APIMessageComponentInteractionData, 
        client: Client, public member?: GuildMember, public guild?: Guild) {
        super(client);
        const d = data as APIApplicationCommandInteractionData;
        this.name = d.name;
        this._id = id;
        this.options = d.options || [];
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