import Client from "./structs/Client";
import Message from "./structs/Message";
import { config } from "dotenv";
config();

const client = new Client(515);

client.on("ready", () => {
    console.log(client.user.tag);
})

client.on("message", (message: Message) => {
    if (message.author.bot) return console.log("This user is a bot! Wow!");
    if (message.content.toLowerCase() === "!what") {
        message.channel.send("This bot was made for pure learning!")
    }
})

client.on("debug", console.log);

client.login("Njk5ODUxMTkyNjY2NDIzMzI2.XpaZNg.TUbitsWZMZF5IUcBacmgB9QWT68") // Uses process.env.DISCORD_TOKEN if no token is provided.