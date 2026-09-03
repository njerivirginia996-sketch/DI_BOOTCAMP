function makeJuice(size) {
	function addIngredients(firstIngredient, secondIngredient, thirdIngredient) {
		document.getElementById("juice").textContent =
			`The client wants a ${size} drink juice, containing ${firstIngredient}, ${secondIngredient}, ${thirdIngredient}.`;
	}

	addIngredients("apple", "carrot", "ginger");
}

makeJuice("medium");
