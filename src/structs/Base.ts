import Client from "./Client";

export default class Base {
    client: Client
    constructor(client: Client) {
        this.client = client;
    }
}