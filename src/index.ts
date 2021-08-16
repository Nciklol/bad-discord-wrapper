import Client from "./structs/Client";
import Message from "./structs/Message";
import MessageEmbed from "./structs/MessageEmbed";
import { config } from "dotenv";

config();

const client = new Client(515);

client.on("ready", () => {
    console.log(client.user.tag);
});

client.on("message", async (message: Message) => {
    if (message.author.bot) return console.log("This user is a bot! Wow!");
    
    if (message.content.toLowerCase() === "!ping") {
        message.react("🏓");
        const embed = new MessageEmbed().setDescription("Pong").setColor("BLURPLE")
            .setTimestamp().setURL("https://example.com").setFooter("test", message.author.displayAvatarURL({dynamic: true}));

        const msg = await message.channel.send({content: `Responding...`, embeds: [embed]});

        await msg.edit(`Took ${msg.createdTimestamp - message.createdTimestamp}ms`);
    } else if (message.content.toLowerCase() === "!amiadmin") {
        if (message.member.permissions.has("ADMINISTRATOR")) {
            message.channel.send("Yes!");
        } else message.channel.send("No!");
    }
});

client.on("debug", console.log);

client.login(); // Uses process.env.DISCORD_TOKEN if no token is provided.