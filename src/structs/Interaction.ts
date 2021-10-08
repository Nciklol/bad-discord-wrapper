
import { APIApplicationCommandInteractionDataOption } from "discord-api-types";
import Base from "./Base";
import type Client from "./Client";
import CommandInteraction from "./CommandInteraction";

export default class Interaction extends Base {
    public options: APIApplicationCommandInteractionDataOption[];
    public id: string;
    public token: string;
    public responded: boolean;

    constructor(client: Client, public type: number) {
        super(client);
    }

    public isCommand(): this is CommandInteraction {
        return this.type === 2;
    }
}