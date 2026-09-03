const lettersOnlyInput = document.getElementById('letters-only');

lettersOnlyInput.addEventListener('input', (event) => {
	event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '');
});
