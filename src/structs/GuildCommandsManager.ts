import ApplicationCommand, { ApplicationCommandOptions } from "./ApplicationCommand";
import Collection from "@discordjs/collection";
import { Snowflake, APIApplicationCommand } from "discord-api-types";
import APIRequestHandler from "../utils/APIRequestHandler";
import Client from "./Client";

export interface APICommand {
    name: string;
    description: string;
    options?: ApplicationCommandOptions[],
    // eslint-disable-next-line camelcase
    default_permission?: boolean;
    type?: number;
}

export default class GuildCommandsManager extends Collection<Snowflake, ApplicationCommand> {
    public client: Client;

    public constructor(public _id: string, client: Client) {
        super();
        Object.defineProperty(this, 'client', { value: client });
    }

    async fetchCommands(): Promise<Collection<string, ApplicationCommand>> {
        const cmds = await APIRequestHandler.fetchGuildCommands(this.client.user.id, this._id, this.client.ws.token);

        if (!cmds) return null;
        
        console.log(cmds);

        for (const cmd of cmds) {
            const opts: ApplicationCommandOptions[] = [];

            if (cmd.options) {
                for (const option of cmd.options) {
                    opts.push({
                        type: option.type,
                        choices: null,
                        description: option.description,
                        name: option.name,
                        required: option.required || false,
                        options: null
                    });
                }
            }
            this.set(cmd.id, new ApplicationCommand(cmd.id, null, cmd.name, cmd.description, opts, cmd.default_permission));
        }

        return this;
    }

    public async create(data: APICommand): Promise<ApplicationCommand> {
        const apiCommand = await APIRequestHandler.createGuildCommand(data, this.client.user.id, this._id, this.client.ws.token);
        
        if (!apiCommand) return null;

        return new ApplicationCommand(apiCommand.id, 3, apiCommand.name, apiCommand.description, null, apiCommand.default_permission);
    }
}