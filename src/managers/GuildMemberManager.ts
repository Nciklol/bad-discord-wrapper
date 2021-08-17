import { Snowflake, APIGuildMember } from "discord-api-types";
import Collection from "@discordjs/collection";
import GuildMember from "../structs/GuildMember";
import APIRequestHandler from "../utils/APIRequestHandler";
import Guild from "../structs/Guild";
import Utils from "../utils/Utils";
import Base from "../structs/Base";
import Client from "../structs/Client";

export default class GuildMemberManager extends Base {
    public cache = new Collection<Snowflake, GuildMember>();

    constructor(public guild: Guild, client: Client, members: APIGuildMember[]) {
        super(client);

        members.forEach(member => {
            this.client.users.set(member.user.id, Utils.convertAPIUser(member.user));
            this.cache.set(member.user.id, Utils.convertAPIMember(member.user, member, this.guild, this.client));
        });
    }

    public async fetch(limit: number = null): Promise<Collection<Snowflake, GuildMember> | null> {
        const members = await APIRequestHandler.listGuildMembers(this.guild.id, this.client.ws.token, limit);

        if (!members) return null;

        const col = new Collection<Snowflake, GuildMember>();

        for (const member of members) {
            col.set(member.user.id, Utils.convertAPIMember(member.user, member, this.guild, this.client));
        }

        return col;
    }
}