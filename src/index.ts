import Discord from "discord.js";
import config from "./config.json";

const client = new Discord.Client();

client.on("ready", () => {
	//console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;
	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift()?.toLowerCase();

	if (command === "ping") {
		message.reply("Pong!");
	}
});

client.login(config.token);
