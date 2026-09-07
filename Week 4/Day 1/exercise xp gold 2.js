//exercise 1
function sumArray(arr) {
  return arr.reduce((sum, current) => sum + current, 0);
}

console.log(sumArray([1, 2, 3, 4, 5])); // 15


//exercise 2
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]


//exercise 3
function removeFalsy(arr) {
  return arr.filter(Boolean);
}

console.log(removeFalsy([NaN, 0, 15, false, -22, '', undefined, 47, null]));
// [15, -22, 47]


//exercise 4
function repeat(str, n = 1) {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += str;
  }
  return result;
}

console.log(repeat('Ha!', 3)); // "Ha!Ha!Ha!"
console.log(repeat('Ha!'));    // "Ha!"


//exercise 5
const startLine = '     ||<- Start line';
let turtle = '🐢';
let rabbit = '🐇';

turtle = turtle.padStart(8);
rabbit = rabbit.padStart(8);

console.log(startLine);
console.log(turtle);
console.log(rabbit);