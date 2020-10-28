import Discord from "discord.js";

export default interface CommandInterface {
	name: string;
	description: string;
	usage?: string;
	args?: [number, number]; // min, max
	execute(message: Discord.Message, args?: string[]): void;
}
