import { Snowflake} from "discord-api-types";
import handler from "../utils/APIRequestHandler";
import { MessageOptions } from "./Message";
import Utils from "../utils/Utils";
import Base from "./Base";
import Guild from "./Guild";
import Message from "./Message";
import MessageEmbed from "./MessageEmbed";
import Client from "./Client";

export default class Channel extends Base {
    constructor(public id: Snowflake, public guild: Guild, public name: string, client: Client ) {
        super(client);
    }

    public async send(content: string | MessageEmbed | MessageOptions): Promise<Message> {
        const msg = await handler.sendMessage(this.id, content, this.client.ws.token);
        if (!msg) return null;
        
        return Utils.convertAPIMessage(msg, this, this.client);
    }
}