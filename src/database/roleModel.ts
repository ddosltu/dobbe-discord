import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;
//const ObjectId = Schema.ObjectId;

export interface IRole extends Document {
	commandRole: string;
	discordRole: string;
}

const roleSchema = new Schema<IRole>({
	commandRole: String,
	discordRole: String,
});

export default mongoose.model("Role", roleSchema);
