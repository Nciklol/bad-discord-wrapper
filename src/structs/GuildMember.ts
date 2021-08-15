import { Snowflake } from "discord-api-types";
import Collection from "@discordjs/collection";
import User from "./User";
import Guild from "./Guild";
import Role from "./Role";

export default class GuildMember {
    public id: Snowflake = null;
    public displayName: string = null;
    public roles = new Collection<Snowflake, Role>();
    public permissions: string;

    constructor(public user: User, public nick: string | null, roles: string[], public guild: Guild) {
        roles.forEach((id) => {
            const role = guild.roles.get(id);
            if (!id) {
                console.log(`Could not find role ${role}`);
            } else {
                this.roles.set(role.id, role);
            }
        });
        this.id = user.id;
        this.displayName = nick || user.username;
        
        let permissions: number;

        for (const permission of this.roles.map((role) => role.permissions)) {
            permissions += Number(permission);
        }

        this.permissions = permissions.toString();
    }
}