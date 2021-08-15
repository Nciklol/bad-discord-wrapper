export const OPCodes = {
  Dispatch: 0,
  Heartbeat: 1,
  Identify: 2,
  Presence_Update: 3,
  Voice_State_Update: 4,
  Resume: 6,
  Reconnect: 7,
  Request_Guild_Members: 8,
  Invalid_Session: 9,
  Hello: 10,
  Heartbeat_ACK: 11,
};

export const DAPI_EVENTS = {
  READY: "READY",
  GUILD_CREATE: "GUILD_CREATE",
  MESSAGE_CREATE: "MESSAGE_CREATE",
};
