import { APIMessage, APIUser, Snowflake, APIGuild } from "discord-api-types";
import { EventEmitter } from "stream";
import WebSocket from "ws";
import Guild from "./Guild"
import Collection from "@discordjs/collection";
import User from "./User";
import Utils from "../utils/Utils";

export default class Client extends EventEmitter {
    private _intents: number;
    private _token: string;

    public user?: User = null;
    public guilds? = new Collection<Snowflake, Guild>();


    constructor(intents: number) {
        super();
        this._intents = intents;
    }

    public login(token?: string) {
        this._token = token || process.env.DISCORD_TOKEN;

        if (!this._token) throw new Error("Invalid token");
        if (!Number(this._intents)) throw new Error("Invalid intents")

        this._initWS(this._token, this._intents);
    }

    private async _initWS(token, intents) {
        const ws = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");

        let sessionID;
        let seq;

        ws.on("open", () => {
            this.emit("debug", "WS | Opened connection to discord")
        })

        let readyGuilds = [];
        let ready = false;

        let lastHeartbeat;

        ws.on('message', async (message) => {

            const res = JSON.parse(message.toString()); // Get the response in a json object

            // opcodes: https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-opcodes
            // t = event
            // d = data
        
            if (res["op"] == 0) {
                seq = res.s;
                this.emit("debug", `WS | Recieved ${res.t} event. Event #${seq}`)

                if (res.t == "READY") {
                    const apiUser: APIUser = res.d.user;
                    const user = Utils.convertAPIUser(apiUser);
                    this.user = user;
                    
                    readyGuilds = res.d.guilds.map(g => g.id);
                    this.emit("debug", `WS | Got ${readyGuilds.length} guilds from discord.`)
                    sessionID = res.d.session_id;
                }

                if (res.t == "GUILD_CREATE") {
                    const g: APIGuild = res.d;

                    this.guilds.set(g.id, new Guild(g.id, g.channels, g.name, this._token));
                    if (!ready) {
                        if (readyGuilds.includes(g.id)) {
                            readyGuilds = readyGuilds.filter(x => x !== g.id);
                            if (readyGuilds.length == 0) {
                                ready = true;
                                this.emit("debug", "WS | All guilds loaded. Emitting ready event.")
                                this.emit("ready");
                            }
                            
                        }
                    }
                    
                }

                if (res["t"] == "MESSAGE_CREATE") {
                    const apiMsg: APIMessage = res['d'];
                    const channel = this.guilds.get(apiMsg.guild_id).channels.get(apiMsg.channel_id);
                    const message = Utils.convertAPIMessage(apiMsg, channel);

                    this.emit("message", message);
                }
            }
            
        
            if (res["op"] && res["op"] == 10) { 
        
                const indetify_data = { // Identify payload (https://discord.com/developers/docs/topics/gateway#identify-identify-structure)
                    "op": 2, 
                    "d": {
                      "token": token,
                      "intents": intents,
                      "properties": {
                        "$os": "linux",
                        "$browser": "my_library",
                        "$device": "my_library"
                      }
                    }
                  }
            
                ws.send(JSON.stringify(indetify_data)); // Identify after the first heartbeat https://discord.com/developers/docs/topics/gateway#identifying
                this.emit("debug", "WS | Identified with discord.");

                setInterval(() => { // Set the interval to respond to the heartbeat discord sent on an interval for the time they specify https://discord.com/developers/docs/topics/gateway#heartbeating
                    lastHeartbeat = Date.now();
                    this.emit("debug", "WS | Sent heartbeat")
                    ws.send(JSON.stringify({
                        "op": 1,
                        "d": 251
                    }))
                    
                }, res["d"]["heartbeat_interval"])
            }

            if (res["op"] == 9) {
                const time = Math.floor(Math.random() * 5) + 1;
                this.emit("debug", `WS | Invalid session. Reconnecting in ${time} seconds.`)
                setTimeout(() => {
                    const indetify_data = {
                        "op": 2, 
                        "d": {
                          "token": token,
                          "intents": intents,
                          "properties": {
                            "$os": "linux",
                            "$browser": "my_library",
                            "$device": "my_library"
                          }
                        }
                      }
                
                    ws.send(JSON.stringify(indetify_data));
                    this.emit("debug", "WS | Re-Identified with discord.");
                }, time * 1000);
            }

            if (res.op == "11") this.emit("debug", `WS | Heartbeat acknowledged in ${Date.now() - lastHeartbeat}ms`);
        });
    }
}