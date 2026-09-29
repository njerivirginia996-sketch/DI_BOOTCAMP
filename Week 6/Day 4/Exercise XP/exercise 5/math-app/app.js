const _ = require("lodash");
const { add, multiply } = require("./math");

const numbers = [1, 2, 3, 4, 5];

console.log("Addition:", add(10, 5));
console.log("Multiplication:", multiply(10, 5));

console.log("Sum using Lodash:", _.sum(numbers));
console.log("Maximum using Lodash:", _.max(numbers));