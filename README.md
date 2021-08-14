# Bad Discord API Wrapper

## Why
This is not meant for production, its simply meant to serve as a way for me to learn how to use websockets and how to get a better grasp of interacting with APIs, and it might help you learn the basics as well (?)  

## Features
- Allows you to send, edit, and react to messages via embed**s** and strings.

## Events

- `ready` - Fired when discord is finished sending all guilds.
- `message` - Fired when discord sends a message.
- `debug` - Sends WS information to the console to help you easily debug some of the many issues that I probably have.

## What not to expect

- **ANY** help with ratelimits. Currently the only information the bot sends to the api is messages, do not abuse it or you will get ratelimited, which the client also doesn't currently tell you about.
- Any resuming to be done from the client, mainly because I'm not sure how to know when the client is disconnected. However the client is built to respond to discord invalidating the session and will reconnect after 1-5 seconds (per discord api).
- The vast majority of properties on discord.js.


## Contributing

If for some reason you want to expand this, feel free to clone this repo and code your heart out and open a PR.

## Support

[YBot Support Server](https://discord.gg/STe9YQgtz2) (I'm not making a discord dedicated to this -- feel free to join my support server for another project and talk about it in the #bad-discord-wrapper channel.)




