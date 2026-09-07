//exercise 1
const menu = [
  { type: "starter", name: "Houmous with Pita" },
  { type: "starter", name: "Vegetable Soup with Houmous peas" },
  { type: "dessert", name: "Chocolate Cake" }
];

// 1. Check if at least one element is a dessert (using ternary)
const hasDessert = menu.some(item => item.type === "dessert") 
  ? "Yes, there's a dessert" 
  : "No dessert here";
console.log(hasDessert); // "Yes, there's a dessert"

// 2. Check if ALL elements are starters
const allStarters = menu.every(item => item.type === "starter");
console.log(allStarters); // false

// 3. Check if there's at least one main course; if not, add one
const hasMain = menu.some(item => item.type === "main");
if (!hasMain) {
  menu.push({ type: "main", name: "Grilled Salmon" });
}
console.log(menu);

// 4. Add a "vegetarian" boolean key based on the vegetarian array
const vegetarian = ["vegetable", "houmous", "eggs", "vanilla", "potatoes"];

const menuWithVeg = menu.map(item => {
  const isVegetarian = vegetarian.some(vegWord => 
    item.name.toLowerCase().includes(vegWord.toLowerCase())
  );
  return { ...item, vegetarian: isVegetarian };
});

console.log(menuWithVeg);


//exercise 2
function string_chop(str, chunkLength) {
  const result = [];
  for (let i = 0; i < str.length; i += chunkLength) {
    result.push(str.slice(i, i + chunkLength));
  }
  return result;
}

console.log(string_chop('developers', 2)); 
// ["de", "ve", "lo", "pe", "rs"]

console.log(string_chop('hello world', 3));
// ["hel", "lo ", "wor", "ld"]


//exercise 3
function search_word(str, word) {
  const regex = new RegExp(word, 'g');
  const matches = str.match(regex);
  const count = matches ? matches.length : 0;
  return `'${word}' was found ${count} times.`;
}

console.log(search_word('The quick brown fox', 'fox')); 
// "'fox' was found 1 times."

console.log(search_word('the cat sat on the mat with the hat', 'the'));
// "'the' was found 1 times." (case-sensitive: only matches lowercase "the")


//exercise 4
function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }

  return arr;
}

console.log(reverseArray([1, 2, 3, 4, 5]));  // [5, 4, 3, 2, 1]
console.log(reverseArray([1, 2]));           // [2, 1]
console.log(reverseArray([]));               // []
console.log(reverseArray([1,2,3,4,5,6,7,8,9,10])); // [10,9,8,7,6,5,4,3,2,1]