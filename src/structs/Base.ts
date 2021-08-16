import Client from "./Client";

export default class Base {
    client: Client
    constructor(client: Client) {
        Object.defineProperty(this, 'client', { value: client });
    }
}