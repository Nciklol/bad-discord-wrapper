import Client from "../structs/Client";
import WebSocket from "ws";
import { APIMessage, APIUser, Snowflake, APIGuild, APIInteraction, GatewayMessageReactionAddDispatch } from "discord-api-types";
import Guild from "../structs/Guild";
import { OPCodes, DAPI_EVENTS } from "../utils/Constants";
import Utils from "../utils/Utils";
import Collection from "@discordjs/collection";
import ClientApplication from "../structs/ClientApplication";

export default class WebSocketManager {
    public ws = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");

    private lastHeartbeat: number = null;
    private readyGuilds: Snowflake[] = [];

    public seq: number;

    private _ready = false;

    constructor(public client: Client, public token: string, public intents: number) {
        this.ws.once("open", () => this.client.emit("debug", "Opened connection to Discord"));

        this.ws.on("message", (req) => this.handleReq(req, this.ws));
    }

    private handleReq(req: WebSocket.Data, ws: WebSocket) {
        const res = JSON.parse(req.toString());

        // opcodes: https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-opcodes
        // t = event
        // d = data

        if (res.op == OPCodes.Dispatch) {
            this.seq = res.s;
            this.client.emit("debug", `WS | Recieved ${res.t} event. Event #${this.seq}`);
            this.client.emit("raw", res);

            if (res.t == DAPI_EVENTS.READY) {
                const apiUser: APIUser = res.d.user;
                const user = Utils.convertAPIUser(apiUser);
                this.client.user = user;
                this.client.application = new ClientApplication(user.id, this.client);

                this.readyGuilds = res.d.guilds.map((g) => g.id);
                this.client.emit(
                    "debug",
                    `WS | Got ${this.readyGuilds.length} guilds from discord.`
                );
            } else if (res.t == DAPI_EVENTS.MESSAGE_CREATE) {
                const apiMsg: APIMessage = res.d;
                const channel = this.client.guilds
                    .get(apiMsg.guild_id)
                    .channels.get(apiMsg.channel_id);
                const message = Utils.convertAPIMessage(
                    apiMsg,
                    channel,
                    this.client
                );

                if (!this.client.messages.has(channel.id)) {
                    this.client.messages.set(channel.id, new Collection([[message.id, message]]));
                } else {
                    const clientChannel = this.client.messages.get(channel.id);

                    if (clientChannel.size >= 200) {
                        clientChannel.delete(clientChannel.firstKey());
                    }

                    clientChannel.set(message.id, message);
                }

                this.client.emit("messageCreate", message);
            } else if (res.t == DAPI_EVENTS.MESSAGE_UPDATE) {
                const apiMsg: APIMessage = res.d;
                const channel = this.client.guilds
                    .get(apiMsg.guild_id)
                    .channels.get(apiMsg.channel_id);
                const message = Utils.convertAPIMessage(
                    apiMsg,
                    channel,
                    this.client
                );
                const oldMessage = this.client.messages.get(channel.id).get(message.id);
                if (!oldMessage) this.client.emit("messagePartialUpdate", message);
                else {
                    this.client.emit("messageUpdate", oldMessage, message);
                    this.client.messages.get(channel.id).set(message.id, message);
                }
            } else if (res.t == DAPI_EVENTS.GUILD_MEMBER_UPDATE) {
                const newMember = Utils.convertAPIMember(res.d.user, res.d, this.client.guilds.get(res.d.guild_id), this.client);
                const oldMember = Object.freeze(this.client.guilds.get(newMember.guild.id).members.cache.get(newMember.id));
                
                this.client.guilds.get(newMember.guild.id).members.cache.set(newMember.id, newMember);
                this.client.emit("guildMemberUpdate", oldMember, newMember);
            } else if (res.t == DAPI_EVENTS.GUILD_MEMBER_ADD) {
                this.client.users.set(res.d.user.id, Utils.convertAPIUser(res.d.user));
                this.client.emit("guildMemberAdd", Utils.convertAPIMember(res.d.user, res.d, this.client.guilds.get(res.d.guild_id), this.client));
            } else if (res.t == DAPI_EVENTS.GUILD_MEMBER_REMOVE) {
                this.client.users.delete(res.d.user.id);
                this.client.emit("guildMemberRemove", res.d.guild_id, Utils.convertAPIUser(res.d.user));
            } else if (res.t == DAPI_EVENTS.GUILD_CREATE) {
                const g: APIGuild = res.d;
                
                this.client.guilds.set(
                    g.id,
                    new Guild(
                        g.id,
                        g.channels,
                        g.roles,
                        g.name,
                        g.member_count,
                        g.members,
                        this.client
                    )
                );
                if (!this._ready) {
                    if (this.readyGuilds.includes(g.id)) {
                        this.readyGuilds = this.readyGuilds.filter((x) => x !== g.id);
                        if (this.readyGuilds.length == 0) {
                            this._ready = true;
                            this.client.emit(
                                "debug",
                                "WS | All guilds loaded. Emitting ready event."
                            );
                            this.client.emit("ready");
                        }
                    }
                } 
            } else if (res.t == DAPI_EVENTS.INTERACTION_CREATE) {
                const interaction: APIInteraction = res.d;
                this.client.emit("interactionCreate", Utils.convertAPIInteraction(interaction, this.client));
            } else if (res.t == DAPI_EVENTS.MESSAGE_REACTION_ADD) {
                const data = res as GatewayMessageReactionAddDispatch;

                if (!this.client.messages.get(data.d.channel_id).get(data.d.message_id)) return;
                const reaction = Utils.convertAPIReaction(data.d, this.client);

                this.client.emit("messageReactionAdd", reaction);
            }
        }

        if (res.op == OPCodes.Hello) {
            const indetifyData = {
            // Identify payload (https://discord.com/developers/docs/topics/gateway#identify-identify-structure)
                op: 2,
                d: {
                    token: this.token,
                    intents: this.intents,
                    properties: {
                        $os: "linux",
                        $browser: "bad-discord-wrapper",
                        $device: "bad-discord-wrapper",
                    },
                },
            };
            this.ws.send(JSON.stringify(indetifyData)); // Identify after the first heartbeat https://discord.com/developers/docs/topics/gateway#identifying
            this.client.emit("debug", "WS | Identified with discord.");

            this.client.emit(
                "debug",
                `WS | Sending a heartbeat every ${res.d.heartbeat_interval}ms.`
            );
            setInterval(() => {
            // Set the interval to respond to the heartbeat discord sent on an interval for the time they specify https://discord.com/developers/docs/topics/gateway#heartbeating
                this.lastHeartbeat = Date.now();
                this.ws.send(
                    JSON.stringify({
                        op: 1,
                        d: 251,
                    })
                );
                this.client.emit("debug", "WS | Sent heartbeat");
            }, res.d.heartbeat_interval);
        }

        if (res.op == OPCodes.Invalid_Session) {
            const time = Math.floor(Math.random() * 5) + 1;
            this.client.emit("debug", `WS | Invalid session. Reconnecting in ${time} seconds.`);
            setTimeout(() => {
                const indetifyData = { // Identify payload (https://discord.com/developers/docs/topics/gateway#identify-identify-structure)
                    "op": 2, 
                    "d": {
                        "token": this.token,
                        "intents": this.intents,
                        "properties": {
                            "$os": "linux",
                            "$browser": "my_library",
                            "$device": "my_library"
                        }
                    }
                };
            
                ws.send(JSON.stringify(indetifyData));
                this.client.emit("debug", "WS | Re-Identified with discord.");
            }, time * 1000);
        }

        if (res.op == OPCodes.Heartbeat_ACK) {
            this.client.emit(
                "debug",
                `WS | Heartbeat acknowledged in ${
                    Date.now() - this.lastHeartbeat
                }ms`
            );
        }
    }
}