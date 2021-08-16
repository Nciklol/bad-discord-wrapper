// Generated from all keys in Permission.FLAGS (Used a terminal to generate it), not sure if there's a better way to do this type
interface Permission {
  'CREATE_INSTANT_INVITE',
  'KICK_MEMBERS',
  'BAN_MEMBERS',
  'ADMINISTRATOR',
  'MANAGE_CHANNELS',
  'MANAGE_GUILD',
  'ADD_REACTIONS',
  'VIEW_AUDIT_LOG',
  'PRIORITY_SPEAKER',
  'STREAM',
  'VIEW_CHANNEL',
  'SEND_MESSAGES',
  'SEND_TTS_MESSAGES',
  'MANAGE_MESSAGES',
  'EMBED_LINKS',
  'ATTACH_FILES',
  'READ_MESSAGE_HISTORY',
  'MENTION_EVERYONE',
  'USE_EXTERNAL_EMOJIS',
  'VIEW_GUILD_INSIGHTS',
  'CONNECT',
  'SPEAK',
  'MUTE_MEMBERS',
  'DEAFEN_MEMBERS',
  'MOVE_MEMBERS',
  'USE_VAD',
  'CHANGE_NICKNAME',
  'MANAGE_NICKNAMES',
  'MANAGE_ROLES',
  'MANAGE_WEBHOOKS',
  'MANAGE_EMOJIS_AND_STICKERS',
  'USE_APPLICATION_COMMANDS',
  'REQUEST_TO_SPEAK',
  'MANAGE_THREADS',
  'USE_PUBLIC_THREADS',
  'USE_PRIVATE_THREADS',
  'USE_EXTERNAL_STICKERS'
}

export default class Permissions {
    constructor(public bits: bigint) {

    }

    public has(permission: keyof Permission): boolean {
        return (this.bits & Permissions.FLAGS[permission]) === Permissions.FLAGS[permission];
    }

    public toArray(): string[] {
        return Object.keys(Permissions.FLAGS).filter(permission => this.has(permission as keyof Permission));
    }

    // https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
    public static FLAGS = {
        CREATE_INSTANT_INVITE: 1n << 0n,
        KICK_MEMBERS: 1n << 1n,
        BAN_MEMBERS: 1n << 2n,
        ADMINISTRATOR: 1n << 3n,
        MANAGE_CHANNELS: 1n << 4n,
        MANAGE_GUILD: 1n << 5n,
        ADD_REACTIONS: 1n << 6n,
        VIEW_AUDIT_LOG: 1n << 7n,
        PRIORITY_SPEAKER: 1n << 8n,
        STREAM: 1n << 9n,
        VIEW_CHANNEL: 1n << 10n,
        SEND_MESSAGES: 1n << 11n,
        SEND_TTS_MESSAGES: 1n << 12n,
        MANAGE_MESSAGES: 1n << 13n,
        EMBED_LINKS: 1n << 14n,
        ATTACH_FILES: 1n << 15n,
        READ_MESSAGE_HISTORY: 1n << 16n,
        MENTION_EVERYONE: 1n << 17n,
        USE_EXTERNAL_EMOJIS: 1n << 18n,
        VIEW_GUILD_INSIGHTS: 1n << 19n,
        CONNECT: 1n << 20n,
        SPEAK: 1n << 21n,
        MUTE_MEMBERS: 1n << 22n,
        DEAFEN_MEMBERS: 1n << 23n,
        MOVE_MEMBERS: 1n << 24n,
        USE_VAD: 1n << 25n,
        CHANGE_NICKNAME: 1n << 26n,
        MANAGE_NICKNAMES: 1n << 27n,
        MANAGE_ROLES: 1n << 28n,
        MANAGE_WEBHOOKS: 1n << 29n,
        MANAGE_EMOJIS_AND_STICKERS: 1n << 30n,
        USE_APPLICATION_COMMANDS: 1n << 31n,
        REQUEST_TO_SPEAK: 1n << 32n,
        MANAGE_THREADS: 1n << 34n,
        USE_PUBLIC_THREADS: 1n << 35n,
        USE_PRIVATE_THREADS: 1n << 36n,
        USE_EXTERNAL_STICKERS: 1n << 37n,
    }
}