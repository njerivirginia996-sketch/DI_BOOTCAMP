function makeJuice(size) {
	const ingredients = [];

	function addIngredients(firstIngredient, secondIngredient, thirdIngredient) {
		ingredients.push(firstIngredient, secondIngredient, thirdIngredient);
	}

	function displayJuice() {
		document.getElementById("juice").textContent =
			`The client wants a ${size} drink juice, containing ${ingredients.join(", ")}.`;
	}

	addIngredients("apple", "carrot", "ginger");
	addIngredients("orange", "lemon", "mint");
	displayJuice();
}

makeJuice("large");
