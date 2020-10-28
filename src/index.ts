import Discord from "discord.js";
import fs from "fs";
import CommandInterface from "./CommandInterface";
import config from "./config.json";

const client = new Discord.Client();
const prefix = process.env.PREFIX || config.prefix;

client.on("ready", () => {
	console.info(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.BOT_TOKEN);

const loadCommands = async (): Promise<Discord.Collection<string, CommandInterface>> => {
	const commands = new Discord.Collection<string, CommandInterface>();
	const commandFiles = fs.readdirSync("./src/commands").filter((file) => file.endsWith(".ts"));
	for (const file of commandFiles) {
		const commandConstructor = await import(`./commands/${file}`);
		const command = new commandConstructor.Command() as CommandInterface;
		commands.set(command.name, command);
	}
	return commands;
};
loadCommands().then((commands) => {
	client.on("message", (message) => {
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift()?.toLowerCase();
		if (!commandName) return;
		if (!commands.has(commandName)) return;
		const command = commands.get(commandName) as CommandInterface;
		if (command.args && (args.length < command.args[0] || args.length > command.args[1]))
			return message.reply(`You didn't provide any arguments, ${message.author}!`);
		try {
			command.execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply("there was an error trying to execute that command!");
		}
	});
});
