// 1. Prompt user for words separated by commas
const userInput = prompt("Enter several words separated by commas:");

// 2. Convert the input into a clean array of words
const words = (userInput || "")
  .split(",")
  .map((word) => word.trim())
  .filter((word) => word.length > 0);

if (words.length === 0) {
  console.log("Please enter at least one valid word.");
} else {
  // 3. Find the length of the longest word
  let maxLength = 0;
  for (const word of words) {
    if (word.length > maxLength) {
      maxLength = word.length;
    }
  }

  // 4. Create the top and bottom border
  const border = "*".repeat(maxLength + 4);

  // 5. Print the formatted box
  console.log(border);
  for (const word of words) {
    const padding = " ".repeat(maxLength - word.length);
    console.log(`* ${word}${padding} *`);
  }
  console.log(border);
}