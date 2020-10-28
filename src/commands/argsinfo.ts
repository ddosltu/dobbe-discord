import Discord from "discord.js";
import CommandInterface from "../CommandInterface";

export class Command implements CommandInterface {
	name = "args-info";
	description = "Information about the arguments provided.";
	args: [number, number] = [1, Number.MAX_VALUE];
	execute(message: Discord.Message, args: string[]): void {
		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	}
}
