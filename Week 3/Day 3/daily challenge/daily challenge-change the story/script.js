document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('libform');
	const storyElement = document.getElementById('story');
	const shuffleButton = document.getElementById('shuffle-button');
	const inputs = ['noun', 'adjective', 'person', 'verb', 'place'];

	const storyTemplates = [
		(values) => `${values.person} went to ${values.place} to ${values.verb} a ${values.adjective} ${values.noun}.`,
		(values) => `At ${values.place}, ${values.person} discovered a ${values.adjective} ${values.noun} and decided to ${values.verb}.`,
		(values) => `${values.person} used a ${values.adjective} ${values.noun} to ${values.verb} through ${values.place}.`,
		(values) => `Everyone in ${values.place} watched as ${values.person} tried to ${values.verb} the ${values.adjective} ${values.noun}.`
	];

	const getValues = () => Object.fromEntries(
		inputs.map((inputId) => [inputId, document.getElementById(inputId).value.trim()])
	);

	const displayStory = () => {
		const values = getValues();

		if (Object.values(values).some((value) => value === '')) {
			storyElement.textContent = 'Please fill in all fields.';
			return;
		}

		const randomIndex = Math.floor(Math.random() * storyTemplates.length);
		storyElement.textContent = storyTemplates[randomIndex](values);
	};

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		displayStory();
	});

	shuffleButton.addEventListener('click', displayStory);
});
