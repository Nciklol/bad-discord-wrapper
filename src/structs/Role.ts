import { Snowflake } from "discord-api-types";

export default class Role {
    constructor(public id: Snowflake, public name: string, public color: number, public position: number, public hoisted: boolean, public permissions: string) {}
}