// 1. Create the sentence variable
let sentence = "This movie is not that bad, I like it";

// 2. Find the index of "not"
let wordNot = sentence.indexOf("not");

// 3. Find the index of "bad"
let wordBad = sentence.indexOf("bad");

// 4 & 5. Check if both words exist and if "bad" comes after "not"
if (wordNot !== -1 && wordBad !== -1 && wordBad > wordNot) {
  // Extract substring from start up to "not"
  let start = sentence.slice(0, wordNot);
  
  // Extract substring from right after "bad" to the end of the sentence
  let end = sentence.slice(wordBad + 3); // 3 is the length of "bad"
  
  // Combine the parts with "good" in between
  console.log(`${start}good${end}`);
} else {
  // Log original sentence if conditions aren't met
  console.log(sentence);
}