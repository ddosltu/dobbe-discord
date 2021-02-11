import Role from "./roleModel";

export default class RoleService {
	static async getAllRoles() {
		return await Role.find({}, { _id: 0, __v: 0 });
	}

	static async findRole(commandRole: string) {
		return await Role.findOne({ commandRole });
	}

	static async createRole({
		discordRole,
		commandRole,
	}: {
		discordRole: string;
		commandRole: string;
	}) {
		const newRole = {
			discordRole,
			commandRole,
		};
		const response = await new Role(newRole).save();
		return response;
	}

	static async deleteRole(commandRole: string) {
		return await Role.findOneAndDelete({ commandRole });
	}
}
