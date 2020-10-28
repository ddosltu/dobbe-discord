import Discord from "discord.js";
import CommandInterface from "../CommandInterface";
import axios from "axios";

export class Command implements CommandInterface {
	name = "dad";
	description = "Get a random DAD-joke from icanhazdadjoke!";
	args: [number, number] = [0, 1];
	execute(message: Discord.Message, args: string[]): void {
		this.getJoke(args).then((response) => {
			message.reply(response);
		});
	}

	getJoke = async (args?: string[]): Promise<string> => {
		let url = "https://icanhazdadjoke.com/";
		if (args && args.length !== 0)
			url = url + `https://icanhazdadjoke.com/search?term=${args[0]}`;
		return axios
			.get(url, { headers: { Accept: "application/json" } })
			.then((response) => {
				let jokeData = response.data;
				if (jokeData.results) {
					const results: any[] = response.data.results;
					if (results.length === 0) {
						return "I think you must be the one joking with that request";
					}
					const index = Math.floor(Math.random() * Math.floor(results.length));
					jokeData = results[index];
				}
				return jokeData.joke;
			})
			.catch((error) => {
				console.error(error);
				return "Ha, jokes on you! Something went wrong, other than your choice of education.";
			});
	};
}
