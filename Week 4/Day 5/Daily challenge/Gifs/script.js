const apiKey = "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";
const form = document.getElementById("gif-form");
const input = document.getElementById("search-input");
const gifContainer = document.getElementById("gif-container");
const deleteAllButton = document.getElementById("delete-all-btn");
const status = document.getElementById("status");

async function getRandomGif(category) {
	const url = new URL("https://api.giphy.com/v1/gifs/random");
	url.searchParams.set("api_key", apiKey);
	url.searchParams.set("tag", category);
	url.searchParams.set("rating", "g");

	try {
		status.textContent = "Loading...";
		const response = await fetch(url);

		if (!response.ok) {
			if (response.status === 429) {
				throw new Error("Giphy rate limit reached. Try again later.");
			}
			throw new Error(`Request failed with status ${response.status}.`);
		}

		const result = await response.json();
		const gifUrl = result.data?.images?.original?.url;

		if (!gifUrl) {
			throw new Error("No GIF was found for that category.");
		}

		appendGif(gifUrl);
		status.textContent = "";
	} catch (error) {
		console.error(error);
		status.textContent = error.message;
	}
}

function appendGif(gifUrl) {
	const gifItem = document.createElement("div");
	gifItem.className = "gif-item";

	const image = document.createElement("img");
	image.src = gifUrl;
	image.alt = "Random GIF";

	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.textContent = "DELETE";
	deleteButton.addEventListener("click", () => gifItem.remove());

	gifItem.append(image, deleteButton);
	gifContainer.appendChild(gifItem);
}

form.addEventListener("submit", async event => {
	event.preventDefault();
	await getRandomGif(input.value.trim());
	input.value = "";
});

deleteAllButton.addEventListener("click", () => {
	gifContainer.replaceChildren();
});
