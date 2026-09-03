// Exercise 1: Nested functions
// Prediction: landscape() returns "____/''''\\____".
// The flat function adds four underscores, mountain adds /, four apostrophes,
// and \\, then the final flat call adds four more underscores.

const landscape = () => {
	let result = "";

	const flat = (length) => {
		for (let count = 0; count < length; count++) {
			result += "_";
		}
	};

	const mountain = (height) => {
		result += "/";
		for (let count = 0; count < height; count++) {
			result += "'";
		}
		result += "\\";
	};

	flat(4);
	mountain(4);
	flat(4);

	return result;
};

console.log(landscape());

// Exercise 2: Closure
// Prediction: addTo(10) returns a function that remembers x as 10.
// Calling that function with 3 returns 10 + 3, which is 13.
const addTo = (x) => (y) => x + y;
const addToTen = addTo(10);
console.log(addToTen(3));

// Exercise 3: Currying
// Prediction: curriedSum(30) returns a function waiting for b. With b = 1,
// the result is 30 + 1, which is 31.
const curriedSum = (a) => (b) => a + b;
console.log(curriedSum(30)(1));

// Exercise 4: Currying
// Prediction: curriedSum(5) creates add5, which adds 5 to its argument.
// Therefore, add5(12) returns 17.
const add5 = curriedSum(5);
console.log(add5(12));

// Exercise 5: Composing
// Prediction: compose applies add5 first, then add1: (10 + 5) + 1 = 16.
const compose = (f, g) => (a) => f(g(a));
const add1 = (num) => num + 1;
const addFive = (num) => num + 5;
console.log(compose(add1, addFive)(10));
