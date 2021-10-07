import Collection from "@discordjs/collection";
import { Snowflake, APIApplicationCommand } from "discord-api-types";
import { Client } from "..";
import APIRequestHandler from "../utils/APIRequestHandler";
import ApplicationCommand, { ApplicationCommandOptions } from "./ApplicationCommand";

export default class ClientApplicationCommandsManager extends Collection<Snowflake, ApplicationCommand> {
    public client: Client;
    constructor(client: Client, private _applicationID: Snowflake) {
        super();
        Object.defineProperty(this, 'client', { value: client });
    }

    public async fetch(): Promise<ClientApplicationCommandsManager> {
        const cmds = await APIRequestHandler.fetchApplicationCommands(this._applicationID, this.client.ws.token);

        if (!cmds) return null;

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
}