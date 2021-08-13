import MessageEmbed from "../structs/MessageEmbed";
import { APIEmbed } from "discord-api-types";

export interface MessageOptions {
    content?: string;
    embeds?: MessageEmbed[] | APIEmbed[];
}

export type ColorResolvable =
| 'DEFAULT'
| 'WHITE'
| 'AQUA'
| 'GREEN'
| 'BLUE'
| 'YELLOW'
| 'PURPLE'
| 'LUMINOUS_VIVID_PINK'
| 'FUCHSIA'
| 'GOLD'
| 'ORANGE'
| 'RED'
| 'GREY'
| 'DARKER_GREY'
| 'NAVY'
| 'DARK_AQUA'
| 'DARK_GREEN'
| 'DARK_BLUE'
| 'DARK_PURPLE'
| 'DARK_VIVID_PINK'
| 'DARK_GOLD'
| 'DARK_ORANGE'
| 'DARK_RED'
| 'DARK_GREY'
| 'LIGHT_GREY'
| 'DARK_NAVY'
| 'BLURPLE'
| 'GREYPLE'
| 'DARK_BUT_NOT_BLACK'
| 'NOT_QUITE_BLACK'
| 'RANDOM';