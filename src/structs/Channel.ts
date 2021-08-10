import { Snowflake, APIGuild} from "discord-api-types";
import { sendMessage } from "../api";

export default class Channel {

    constructor(public id: Snowflake, public guild: APIGuild, public name: string, private _token: string) {};

    public send(content: string) {
        return sendMessage(this.id, content, this._token);
    }
}