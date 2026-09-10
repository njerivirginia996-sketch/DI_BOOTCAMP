//1st daily challenge
function makeAllCaps(words) {
	return new Promise((resolve, reject) => {
		if (words.every(word => typeof word === "string")) {
			resolve(words.map(word => word.toUpperCase()));
		} else {
			reject("Error: all elements must be strings");
		}
	});
}

function sortWords(words) {
	return new Promise((resolve, reject) => {
		if (words.length > 4) {
			resolve([...words].sort());
		} else {
			reject("Error: the array must contain more than 4 words");
		}
	});
}

makeAllCaps([1, "pear", "banana"])
	.then(sortWords)
	.then(result => console.log(result))
	.catch(error => console.log(error));

makeAllCaps(["apple", "pear", "banana"])
	.then(sortWords)
	.then(result => console.log(result))
	.catch(error => console.log(error));

makeAllCaps(["apple", "pear", "banana", "melon", "kiwi"])
	.then(sortWords)
	.then(result => console.log(result))
	.catch(error => console.log(error));

//2nd daily challenge
const morse = `{
	"0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
	"5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
	"a": ".-", "b": "-...", "c": "-.-.", "d": "-..", "e": ".", "f": "..-.",
	"g": "--.", "h": "....", "i": "..", "j": ".---", "k": "-.-", "l": ".-..",
	"m": "--", "n": "-.", "o": "---", "p": ".--.", "q": "--.-", "r": ".-.",
	"s": "...", "t": "-", "u": "..-", "v": "...-", "w": ".--", "x": "-..-",
	"y": "-.--", "z": "--..", ".": ".-.-.-", ",": "--..--", "?": "..--..",
	"!": "-.-.--", "-": "-....-", "/": "-..-.", "@": ".--.-.", "(": "-.--.",
	")": "-.--.-"
}`;

function toJs() {
	return new Promise((resolve, reject) => {
		const morseJS = JSON.parse(morse);

		if (Object.keys(morseJS).length === 0) {
			reject("Error: the Morse object is empty");
		} else {
			resolve(morseJS);
		}
	});
}

function toMorse(morseJS) {
	return new Promise((resolve, reject) => {
		const userInput = prompt("Enter a word or sentence to translate to Morse code:");
		const translation = [];

		for (const character of userInput.toLowerCase()) {
			if (character === " ") {
				continue;
			}

			if (!Object.prototype.hasOwnProperty.call(morseJS, character)) {
				reject(`Error: the character "${character}" does not exist in the Morse object`);
				return;
			}

			translation.push(morseJS[character]);
		}

		resolve(translation);
	});
}

function joinWords(morseTranslation) {
	const morseText = morseTranslation.join("\n");
	const output = document.createElement("pre");
	output.textContent = morseText;
	document.body.appendChild(output);
	console.log(morseText);
}

toJs()
	.then(toMorse)
	.then(joinWords)
	.catch(error => console.log(error));
