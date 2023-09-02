import dotenv from "dotenv";
import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = "dobbe-discord";

const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;

export default async () => {
	dotenv.config();
	const connection = await mongoose.connect(uri);
	return connection;
};
