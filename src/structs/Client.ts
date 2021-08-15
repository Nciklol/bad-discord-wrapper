import { Snowflake } from "discord-api-types";
import { EventEmitter } from "stream";
import Guild from "./Guild";
import Collection from "@discordjs/collection";
import User from "./User";
import WebSocketManager from "../managers/WebSocketManager";

export default class Client extends EventEmitter {
    private _intents: number;

    public user?: User = null;
    public guilds? = new Collection<Snowflake, Guild>();


    constructor(intents: number) {
        super();
        this._intents = intents;
    }

    public login(token?: string): void {
        const access = token || process.env.DISCORD_TOKEN;

        if (!access) throw new Error("Invalid token");
        if (!Number(this._intents)) throw new Error("Invalid intents");

        new WebSocketManager(this, access, this._intents);
    }
}