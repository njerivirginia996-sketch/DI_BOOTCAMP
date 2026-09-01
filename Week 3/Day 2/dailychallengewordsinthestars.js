// 1. Prompt user for words separated by commas
let userInput = prompt("Enter several words separated by commas:");

// Convert string into an array of trimmed words
let words = userInput.split(",").map(word => word.trim());

// 2. Find the length of the longest word
let maxLength = 0;
for (let word of words) {
  if (word.length > maxLength) {
    maxLength = word.length;
  }
}

// 3. Construct border line of stars
let border = "*".repeat(maxLength + 4);

// 4. Console log the formatted box
console.log(border);
for (let word of words) {
  let padding = " ".repeat(maxLength - word.length);
  console.log(`* ${word}${padding} *`);
}
console.log(border);