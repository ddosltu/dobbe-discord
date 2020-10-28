import Discord from "discord.js";
import CommandInterface from "../CommandInterface";
import axios from "axios";

export class Command implements CommandInterface {
	name = "dad";
	description = "Get a random DAD-joke from icanhazdadjoke!";
	args: [number, number] = [0, 1];
	execute(message: Discord.Message, args: string[]): void {
		const url =
			args.length === 0
				? "https://icanhazdadjoke.com/"
				: `https://icanhazdadjoke.com/search?term=${args[0]}`;
		axios
			.get(url, { headers: { Accept: "application/json" } })
			.then((response) => {
				let jokeData = response.data;
				if (jokeData.results) {
					const results: any[] = response.data.results;
					if (results.length === 0) {
						message.reply("I think you must be the one joking with that request");
						return;
					}
					const index = Math.floor(Math.random() * Math.floor(results.length));
					jokeData = results[index];
				}
				message.reply(jokeData.joke);
			})
			.catch((error) => {
				console.error(error);
				message.reply(
					"Ha, jokes on you! Something went wrong, other than your choice of education.",
				);
			});
	}
}
