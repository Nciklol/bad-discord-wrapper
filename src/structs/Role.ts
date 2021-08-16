import { Snowflake } from "discord-api-types";
import Permissions from "../utils/Permissions";

export default class Role {
    public permissions: Permissions;
    constructor(public id: Snowflake, public name: string, public color: number, public position: number, public hoisted: boolean, permissions: string) {
        this.permissions = new Permissions(BigInt(permissions));
    }
}