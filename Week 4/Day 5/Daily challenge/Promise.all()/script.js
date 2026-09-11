const form = document.getElementById("sunrise-form");
const status = document.getElementById("status");
const results = document.getElementById("results");

async function getSunrise(latitude, longitude) {
	const url = `https://api.sunrise-sunset.org/json?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}&formatted=0`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}.`);
	}

	const data = await response.json();
	if (data.status !== "OK") {
		throw new Error("The sunrise API returned an invalid response.");
	}

	return data.results.sunrise;
}

form.addEventListener("submit", async event => {
	event.preventDefault();
	results.replaceChildren();
	status.textContent = "Loading both sunrise times...";

	const coordinates = [
		[document.getElementById("latitude-1").value, document.getElementById("longitude-1").value],
		[document.getElementById("latitude-2").value, document.getElementById("longitude-2").value]
	];

	try {
		const sunriseTimes = await Promise.all(
			coordinates.map(([latitude, longitude]) => getSunrise(latitude, longitude))
		);

		results.innerHTML = `
			<p>First city sunrise: ${formatTime(sunriseTimes[0])}</p>
			<p>Second city sunrise: ${formatTime(sunriseTimes[1])}</p>
		`;
		status.textContent = "Both sunrise times loaded.";
	} catch (error) {
		console.error(error);
		status.textContent = `Could not load sunrise times: ${error.message}`;
	}
});

function formatTime(timestamp) {
	return new Date(timestamp).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "UTC"
	});
}
