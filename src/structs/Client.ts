import { APIGuild, APIMessage, APIUser, Snowflake } from "discord-api-types";
import { EventEmitter } from "stream";
import WebSocket from "ws";
import { sendMessage } from "../api";
import Message from "./Message"
import Channel from "./Channel"
import Guild from "./Guild"
import Collection from "@discordjs/collection";
import User from "./User";
import GuildMember from "./GuildMember";

declare module "discord-api-types" {
    interface APIChannel {
        send(content: string);
    }

    interface APIMessage {
        channel: APIChannel
    }
}

export default class Client extends EventEmitter {
    private _intents: number;
    private _token: string;

    public user?: User = null;
    public guilds? = new Map<Snowflake, Guild>();


    constructor(intents: number) {
        super();
        this._intents = intents;
    }

    public login(token?: string) {
        this._token = token || process.env.DISCORD_TOKEN;

        if (!token) throw new Error("Invalid token");
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
                    const user = new User(apiUser.id, apiUser.username, apiUser.discriminator, apiUser.discriminator, apiUser.bot);
                    this.user = user;
                    
                    readyGuilds = res.d.guilds.map(g => g.id);
                    this.emit("debug", `WS | Got ${readyGuilds.length} guilds from discord.`)
                    sessionID = res.d.session_id;
                }

                if (res.t == "GUILD_CREATE") {
                    const channels = new Collection<Snowflake, Channel>();

                    res['d'].channels.forEach(chan => {
                        channels.set(chan.id, new Channel(chan.id, res.d, chan.name, this._token));
                    })

                    this.guilds.set(res['d']['id'], new Guild(res['d'].id, channels, res.d.name));
                    if (!ready) {
                        if (readyGuilds.includes(res['d']['id'])) {
                            readyGuilds = readyGuilds.filter(x => x !== res['d']['id']);
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
                    const guild = this.guilds.get(apiMsg.guild_id);
                    const channel = guild.channels.find(chan => chan.id == apiMsg.channel_id);
                    const author = new User(apiMsg.author.id, apiMsg.author.username, apiMsg.author.discriminator, apiMsg.author.avatar, apiMsg.author.bot)
                    const member = new GuildMember(apiMsg.id, apiMsg.member?.nick, apiMsg.author)
                    const message = new Message(apiMsg.id, guild, channel, apiMsg.content, author, member);

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
        });
    }
}