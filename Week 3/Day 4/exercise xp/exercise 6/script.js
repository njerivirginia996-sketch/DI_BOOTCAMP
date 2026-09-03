((numberOfChildren, partnerName, geographicLocation, jobTitle) => {
	const fortune = `You will be a ${jobTitle} in ${geographicLocation}, and married to ${partnerName} with ${numberOfChildren} kids.`;
	document.getElementById("fortune").textContent = fortune;
})(3, "Alex", "Paris", "web developer");
