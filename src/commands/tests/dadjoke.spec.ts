import { Command } from "../dadjoke";
import axios from "axios";

jest.mock("axios");

describe("yourModule", () => {
	it("returns a random joke", async () => {
		const command = new Command();

		(axios.get as jest.Mock).mockResolvedValue({
			data: {
				id: "99U0T7hVDlb",
				joke: "Just read a few facts about frogs. They were ribbiting.",
				status: 200,
			},
		});

		await command
			.getJoke()
			.then((data) =>
				expect(data).toBe("Just read a few facts about frogs. They were ribbiting."),
			);
	});

	it("returns a searched joke", async () => {
		const command = new Command();

		(axios.get as jest.Mock).mockResolvedValue({
			data: {
				results: [
					{
						id: "99U0T7hVDlb",
						joke: "Just read a few facts about frogs. They were ribbiting.",
						status: 200,
					},
					{
						id: "Qn3EIRZorrc",
						joke: "I used to be a banker, but I lost interest.",
						status: 200,
					},
					{
						id: "qOK61Tvs4Ed",
						joke: "When do doctors get angry? When they run out of patients.",
						status: 200,
					},
				],
			},
		});

		const possibleOutcomes = [
			"Just read a few facts about frogs. They were ribbiting.",
			"I used to be a banker, but I lost interest.",
			"When do doctors get angry? When they run out of patients.",
		];
		await command
			.getJoke(["whatever"])
			.then((data) => expect(possibleOutcomes).toContain(data));
	});

	it("responds sassy when search query is too narrow", async () => {
		const command = new Command();

		(axios.get as jest.Mock).mockResolvedValue({
			data: {
				results: [],
			},
		});

		await command
			.getJoke(["averynarrowsearchstring"])
			.then((data) =>
				expect(data).toBe("I think you must be the one joking with that request"),
			);
	});
});
