import { Snowflake, APIChannel, APIRole, APIGuildMember } from "discord-api-types";
import Channel from "./Channel";
import Collection from "@discordjs/collection";
import Base from "./Base";
import Role from "./Role";
import Client from "./Client";
import GuildMemberManager from "../managers/GuildMemberManager";

export default class Guild extends Base {
    public channels = new Collection<Snowflake, Channel>();
    public roles = new Collection<Snowflake, Role>();
    public members: GuildMemberManager;

    constructor(public id: Snowflake, channels: APIChannel[], roles: APIRole[], public name: string, 
        public memberCount: number, members: APIGuildMember[], client: Client) {
        super(client);
        
        channels.forEach((chan) => {
            this.channels.set(chan.id, new Channel(chan.id, this, chan.name, this.client));
        });

        roles.forEach((role) => {
            this.roles.set(role.id, new Role(role.id, role.name, role.color, role.position, role.hoist, role.permissions));
        });

        this.members = new GuildMemberManager(this, this.client, members);
    }
}