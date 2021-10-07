import { Snowflake } from "discord-api-types";
import Base from "./Base";
import Client from "./Client";
import ClientApplicationCommandsManager from "./ClientApplicationCommandManager";

export default class ClientApplication extends Base {
    public commands: ClientApplicationCommandsManager;
    
    constructor(public id: Snowflake, client: Client) {
        super(client);

        this.commands = new ClientApplicationCommandsManager(this.client, this.id);
    }
}