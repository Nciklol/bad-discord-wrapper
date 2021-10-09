
# Bad Discord API Wrapper

  

## Why

This is not meant for production, its simply meant to serve as a way for me to learn how to use websockets and how to get a better grasp of interacting with APIs, and it might help you learn the basics as well (?)

  

## Features

- Allows you to send, edit, and react to messages via embed**s** and strings.
- Allows you to create slashies
- Allows you to interact with slashies

  

## Example


TypeScript:

  

```ts

import  { Client }  from  "bad-discord-wrapper";

  

const client =  new Client([Intents.FlAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]);  // Intents are provided via direct number or by array. Get the numbers from `Intents.FLAGS`

  

client.on("ready", () =>  {
    console.log("logged in")
})

client.on("interactionCreate", i => { // Types are already assigned.
    if (i.isCommand()) {
        if (i.name === "ping") {
            i.reply("pong!");
        }
    }
})

  

client.login();  // Log in with token or leave it empty and it will check for process.env.DISCORD_TOKEN

```

  

JavaScript:

  

```js

const { Client } =  require("bad-discord-wrapper");

  

const client =  new Client([Intents.FlAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]);  // Intents are provided via direct number or by array. Get the numbers from `Intents.FLAGS`


client.on("ready", () =>  {
    console.log("logged in")
})

client.on("interactionCreate", i => { // Types are already assigned.
    if (i.isCommand()) {
        if (i.name === "ping") {
            i.reply("pong!");
        }
    }
})

client.login();  // Log in with token or leave it empty and it will check for process.env.DISCORD_TOKEN

```

## Events

  

-  `ready` - Fired when discord is finished sending all guilds.

-  `messageCreate` - Fired when discord sends a message.

-  `debug` - Sends WS information to the console.

-  `guildMemberAdd` - Sends Guild Member Add events

-  `guildMemberRemove` - Sends Guild Member Remove events

-  `messageUpdate` - Sends Message Update events (Caches 200 messages per channel.)

-  `messagePartialUpdate` - In the event a message *is not* cached, this will only send the newMessage.

-  `interactionCreate` - Sends Interactions (Currently only supporting Command Interactions)

## What not to expect

  

-  **ANY** help with ratelimits. Currently the only information the bot sends to the api is messages, do not abuse it or you will get ratelimited, which the client also doesn't currently tell you about.

- Any resuming to be done from the client, mainly because I'm not sure how to know when the client is disconnected. However the client is built to respond to discord invalidating the session and will reconnect after 1-5 seconds (per discord api).

- The vast majority of properties on discord.js.

  
  

## Contributing

  

Checkout the [Contributing](https://github.com/Nciklol/bad-discord-wrapper/blob/main/CONTRIBUTING.md) file.

  

## Support

  

[Support Server](https://discord.gg/STe9YQgtz2) *See the bad-discord-wrapper channel*