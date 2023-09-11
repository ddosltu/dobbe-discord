import Discord from "discord.js";
import CommandInterface from "../CommandInterface";
import RoleService from "../database/roleService";

export class Command implements CommandInterface {
	name = "role";
	description = "Add or remove yourself to a (whitelisted) role.";
	args: [number, number] = [1, 1];
	async execute(message: Discord.Message, args: string[]): Promise<void> {
		switch (args[0]) {
			case "list":
				listRoles(message);
				return;
			default:
				toggleRole(message, args[0]);
		}
	}
}

const toggleRole = async (message: any, roleCommand: string) => {
	const dbRole = await RoleService.findRole(roleCommand);
	if (!dbRole) {
		message.channel.send(`The role ${roleCommand} does not exist`);
		return;
	}
	const roleName = dbRole?.discordRole;
	const guild = message.guild;
	const member = await guild?.members.fetch(message.author as any);
	const role = guild?.roles.cache.find((role: any) => role.name === roleName);
	if (!role) {
		message.channel.send(`The role ${roleName} does not exist`);
		return;
	}
	if (member?.roles.cache.has(role.id)) {
		member?.roles.remove(role);
		message.channel.send(`I deleted your role ${role.name}`);
	} else {
		member?.roles.add(role);
		message.channel.send(`I added ${role.name} to your roles`);
	}
};

const listRoles = async (message: any) => {
	const roles = await RoleService.getAllRoles();
	message.channel.send(roles.toString());
};
