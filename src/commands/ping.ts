import Discord from "discord.js";
import CommandInterface from "../CommandInterface";

export class Command implements CommandInterface {
	name = "ping";
	description = "Ping!";
	execute(message: Discord.Message): void {
		message.channel.send("Pong.");
	}
}
