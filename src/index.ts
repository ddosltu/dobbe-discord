import Discord from "discord.js";
import fs from "fs";
import path from "path";
import CommandInterface from "./CommandInterface";
import config from "./config.json";
import database from "./database/db";
import "dotenv/config";

const client = new Discord.Client({
	partials: ["MESSAGE", "REACTION", "USER", "CHANNEL", "GUILD_MEMBER"],
});
const prefix = process.env.PREFIX || config.prefix;

client.on("ready", () => {
	console.info(`Logged in as ${client.user?.tag}!`);
});

const loadCommands = async (): Promise<Discord.Collection<string, CommandInterface>> => {
	const commands = new Discord.Collection<string, CommandInterface>();
	const commandPath = path.join(__dirname, "commands");
	const commandFiles = fs.readdirSync(commandPath).filter((file) => file.match(/\.(ts|js)$/));
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
			return message.reply(`You didn't provide correct amount of arguments!`);
		try {
			command.execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply("there was an error trying to execute that command!");
		}
	});
});

/**
 * Check if reaction is recieved on <Rules> channel.
 * Add user to <Rules_Accepted_Role_Id>
 */
client.on("messageReactionAdd", async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();

	// Deconstruct settings
	const { enabled, rules_channel_id, rules_accepted_role_id } = config.new_user_accept_rules;

	if (enabled) {
		if (reaction.message.channel.id === rules_channel_id) {
			const message = reaction.message;
			const guild = message.guild;
			const member = await guild?.members.fetch(user as any);
			const role = guild?.roles.cache.find((role) => role.id === rules_accepted_role_id);
			if (role) {
				member?.roles.add(role);
			}
		}
	}
});

const start = async () => {
	try {
		client.login(process.env.BOT_TOKEN);
		await database();
	} catch (error) {
		console.error(error);
	}
};
start();
