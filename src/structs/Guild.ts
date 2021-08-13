import { Snowflake, APIChannel} from "discord-api-types"
import Channel from "./Channel";
import Collection from "@discordjs/collection";
import Base from "./Base";

export default class Guild extends Base {
    public channels = new Collection<Snowflake, Channel>();

    constructor(public id: Snowflake, channels: APIChannel[], public name: string, token: string) {
        super(token);

        channels.forEach(chan => {
            this.channels.set(chan.id, new Channel(chan.id, this, chan.name, this._token))
        })
    }
}