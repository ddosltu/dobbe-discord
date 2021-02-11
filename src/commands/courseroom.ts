import Discord from "discord.js";
import CommandInterface from "../CommandInterface";
import config from "../config.json";
import Role from "../database/roleService";

export class Command implements CommandInterface {
	name = "course";
	description = "Administrate course rooms";
	args: [number, number] = [1, Number.MAX_VALUE];
	admin = true;

	async execute(message: Discord.Message, args: string[]): Promise<void> {
		const configs = config.course_rooms;
		if (!configs.enabled) {
			message.reply("That feature is not enabled");
			return;
		}
		try {
			switch (args[0]) {
				case "add":
					await addCourseRoom(message, args, configs);
					7;
					return;
				case "remove":
					await removeCourseRoom(message, args);
					return;
				default:
					break;
			}
		} catch (error) {
			console.error(error);
		}
	}
}

const addCourseRoom = async (message: Discord.Message, args: string[], configs: any) => {
	// Make sure to be sufficient args
	if (args.length < 3) {
		message.reply(
			"Not the correct amount of arguments. Please use 'courseroom add <channel_name> <course_code> <opt_course_code> ... <opt_course_code>'",
		);
		return;
	}

	const channelName = args[1];
	const commandRoles = args.slice(2);
	const discordRole = `kursrum-${channelName}`;
	const categoryId = configs.category_id;

	// Find or create role
	let role = message.guild?.roles.cache.find((role: any) => role.name === discordRole);
	if (!role) {
		role = await message.guild?.roles.create({ data: { name: discordRole, color: "BLUE" } });
	}

	// Find or create channel
	let channel = message.guild?.channels.cache.find(
		(channel: any) => channel.name === channelName,
	);
	if (!channel) {
		const permissions = new Discord.Permissions(["VIEW_CHANNEL"]);
		channel = await message.guild?.channels.create(channelName, {
			type: "text",
			parent: categoryId,
			permissionOverwrites: [
				{
					id: message.guild.id, // @everyone role
					deny: permissions,
				},
				{
					id: role!.id,
					allow: permissions,
				},
			],
		});
	}

	// Whitelist role auto join
	commandRoles.forEach(async (commandRole: string) => {
		await Role.createRole({ discordRole, commandRole });
	});
	message.reply(
		`I successfully added the role ${discordRole} to the channel ${channelName}. It can be joined by typing 'role <any_added_course_code>'. To list all possible course code, type 'role list'`,
	);
};

const removeCourseRoom = async (message: Discord.Message, args: string[]) => {
	message.reply("This function is not yet added");
};
