import MessageEmbed from "../structs/MessageEmbed";
import { MessageOptions } from "../typings";

export default class Utils extends null {
    
    public static transformOptions(x: string | MessageEmbed | MessageOptions) {
        let options: MessageOptions = {};
        if (typeof x === "string") {
            options.content = x;
        } else if (x instanceof MessageEmbed) {
            options.embeds = [x.toJson]
        } else {
            if (x.content) options.content = x.content;
            if (x.embeds) options.embeds = x.embeds.map(e => e instanceof MessageEmbed && e.toJson);
        }

        return options;
    }
}