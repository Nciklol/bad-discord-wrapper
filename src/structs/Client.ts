import { Snowflake } from "discord-api-types";
import { EventEmitter } from "events";
import Guild from "./Guild";
import Collection from "@discordjs/collection";
import User from "./User";
import WebSocketManager from "../managers/WebSocketManager";
import Message from "./Message";
import GuildMember from "./GuildMember";

interface ClientEvents {
    messageCreate: [message: Message];
    ready: [];
    messageUpdate: [oldMessage: Message, newMessage: Message];
    guildMemberAdd: [member: GuildMember];
    guildMemberRemove: [guildID: Snowflake, user: User];
    debug: [str: string]
}

export default class Client extends EventEmitter {
    private _intents: number;

    public user?: User = null;
    public guilds? = new Collection<Snowflake, Guild>();
    public ws: WebSocketManager = null;
    public messages = new Collection<Snowflake, Collection<Snowflake, Message>>();
    public users = new Collection<Snowflake, User>();

    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Promise<void> | void): this {
        return super.on(event, listener);
    }   

    constructor(intents: number[]) {
        super();
        typeof intents === "number" ? this._intents = intents : this._intents = intents.reduce((x, y) => x += y);
    }

    public login(token?: string): void {
        const access = token || process.env.DISCORD_TOKEN;

        if (!access) throw new Error("Invalid token");
        if (!Number(this._intents)) throw new Error("Invalid intents");

        this.ws = new WebSocketManager(this, access, this._intents);
    }
}