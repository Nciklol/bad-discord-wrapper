import { Snowflake, ApplicationCommandOptionType } from "discord-api-types";

export interface ApplicationCommandOptions {
    type: ApplicationCommandOptionType;
    name: string;
    description: string;
    required?: boolean;
    choices: ApplicationCommandChoice[];
    options: ApplicationCommandOptions[];
}

export interface ApplicationCommandChoice {
    name: string;
    value: string | number;
}

export default class ApplicationCommand {
    constructor(public id: Snowflake, type: number, public name: string, public description: string, public options?: ApplicationCommandOptions[], public defaultPermission = true) {

    }
}