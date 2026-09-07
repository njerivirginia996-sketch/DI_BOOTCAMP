//exercise 1
[1, 2, 3].map(num => {
  if (typeof num === 'number') return num * 2;
  return ;
});
// [2, 4, 6]


//exercise 2
[[0, 1], [2, 3]].reduce(
  (acc, cur) => {
    return acc.concat(cur);
  },
  [1, 2],
);
//[1, 2, 0, 1, 2, 3]


//exercise 3
const arrayNum = [1, 2, 4, 5, 8, 9];
const doubledArray = arrayNum.map((num, i) => {
    console.log(num, i);
    alert(num);
    return num * 2;
})
//num is the current element being processed in the array, and i is the index of that element.


//exercise 4
// 1. Flatten [[1],[2],[3],[[[4]]],[[[5]]]] → [1,2,3,[4],[5]]
const array = [[1], [2], [3], [[[4]]], [[[5]]]];
const newArray = array.flat(2);
console.log(newArray); // [1, 2, 3, [4], [5]]


// 2. Merge each sub-array of words into a sentence
const greeting = [["Hello", "young", "grasshopper!"], ["you", "are"], ["learning", "fast!"]];
const sentences = greeting.map(arr => arr.join(' '));
console.log(sentences); // ["Hello young grasshopper!", "you are", "learning fast!"]


// 3. Turn the greeting array into one single string
const fullSentence = greeting.flat().join(' ');
console.log(fullSentence); // "Hello young grasshopper! you are learning fast!"


// 4. Unwrap the deeply trapped number 3
const trapped = [[[[[[[[[[3]]]]]]]]]];
const result = trapped.flat(Infinity);
console.log(result); // [3]