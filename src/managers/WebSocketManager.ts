import Client from "../structs/Client";
import WebSocket from "ws";
import { APIMessage, APIUser, Snowflake, APIGuild } from "discord-api-types";
import Guild from "../structs/Guild";
import Utils from "../utils/Utils";

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

        if (res.op == 0) {
            this.seq = res.s;
            this.client.emit("debug", `WS | Recieved ${res.t} event. Event #${this.seq}`);
            this.client.emit("raw", res);

            if (res.t == "READY") {
                const apiUser: APIUser = res.d.user;
                const user = Utils.convertAPIUser(apiUser);
                this.client.user = user;
                
                this.readyGuilds = res.d.guilds.map((g) => g.id);
                this.client.emit("debug", `WS | Got ${this.readyGuilds.length} guilds from discord.`);
            }

            if (res.t == "GUILD_CREATE") {
                const g: APIGuild = res.d;

                this.client.guilds.set(g.id, new Guild(g.id, g.channels, g.roles, g.name, g.member_count, this.token));
                if (!this._ready) {
                    if (this.readyGuilds.includes(g.id)) {
                        this.readyGuilds = this.readyGuilds.filter((x) => x !== g.id);
                        if (this.readyGuilds.length == 0) {
                            this._ready = true;
                            this.client.emit("debug", "WS | All guilds loaded. Emitting ready event.");
                            this.client.emit("ready");
                        }
                    }
                }
            }

            if (res["t"] == "MESSAGE_CREATE") {
                const apiMsg: APIMessage = res['d'];
                const channel = this.client.guilds.get(apiMsg.guild_id).channels.get(apiMsg.channel_id);
                const message = Utils.convertAPIMessage(apiMsg, channel, this.token);

                this.client.emit("message", message);
            }
        }

        if (res.op == 10) {
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
            this.ws.send(JSON.stringify(indetifyData)); // Identify after the first heartbeat https://discord.com/developers/docs/topics/gateway#identifying
            this.client.emit("debug", "WS | Identified with discord.");

            this.client.emit("debug", `WS | Sending a heartbeat every ${res.d.heartbeat_interval}ms.`);
            setInterval(() => { // Set the interval to respond to the heartbeat discord sent on an interval for the time they specify https://discord.com/developers/docs/topics/gateway#heartbeating
                this.lastHeartbeat = Date.now();
                this.client.emit("debug", "WS | Sent heartbeat");
                this.ws.send(JSON.stringify({
                    "op": 1,
                    "d": 251
                }));
            }, res["d"]["heartbeat_interval"]);
        }

        if (res["op"] == 9) {
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

        if (res.op == "11") this.client.emit("debug", `WS | Heartbeat acknowledged in ${Date.now() - this.lastHeartbeat}ms`);
    }
}