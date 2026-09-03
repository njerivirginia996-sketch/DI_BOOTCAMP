const mergeWords = (sentence) => (nextWord) =>
	nextWord === undefined ? sentence : mergeWords(`${sentence} ${nextWord}`);

console.log(mergeWords("Hello")());
console.log(mergeWords("There")("is")("no")("spoon.")());
