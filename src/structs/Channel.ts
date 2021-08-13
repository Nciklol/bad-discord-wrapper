import { Snowflake} from "discord-api-types";
import handler from "../api";
import { MessageOptions } from "../typings";
import Utils from "../utils/Utils";
import Base from "./Base";
import Guild from "./Guild";
import MessageEmbed from "./MessageEmbed";

export default class Channel extends Base{

    constructor(public id: Snowflake, public guild: Guild, public name: string, _token: string) {super(_token)};

    public async send(content: string | MessageEmbed | MessageOptions) {
        const msg = await handler.sendMessage(this.id, content, this._token);
        if (!msg) return null;
        
        return Utils.convertAPIMessage(msg, this);
    }
}