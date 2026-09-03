((userName) => {
	const welcomeDiv = document.createElement("div");
	const profilePicture = document.createElement("img");

	profilePicture.src = "https://i.pravatar.cc/80?img=12";
	profilePicture.alt = `${userName}'s profile picture`;
	welcomeDiv.append(profilePicture, document.createTextNode(`Welcome, ${userName}!`));

	document.getElementById("navbar").appendChild(welcomeDiv);
})("John");
