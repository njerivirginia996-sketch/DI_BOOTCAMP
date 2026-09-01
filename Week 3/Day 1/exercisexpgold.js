//exercise 1
```javascript
let numbers = [123, 8409, 100053, 333333333, 7];

for (let number of numbers) {
    console.log(number % 3 === 0);
}
```

//exercise 2
let guestList = {
  randy: "Germany",
  karla: "France",
  wendy: "Japan",
  norman: "England",
  sam: "Argentina"
};

// 1. Prompt the student for their name
let studentName = prompt("Please enter your name:");

// Convert input to lowercase to allow case-insensitive matching (optional but user-friendly)
let nameKey = studentName ? studentName.toLowerCase() : "";

// 2 & 3. Check if the name exists in the object using the 'in' operator
if (nameKey in guestList) {
  console.log(`Hi! I'm ${studentName}, and I'm from ${guestList[nameKey]}.`);
} else {
  console.log("Hi! I'm a guest.");
}


//exercise 3
let age = [20, 5, 12, 43, 98, 55];

// 1. Calculate and log the sum of all numbers
let sum = 0;
for (let i = 0; i < age.length; i++) {
  sum += age[i];
}
console.log("Sum:", sum);

// 2. Find and log the highest age
let highest = age[0]; // Start with the first element as the baseline
for (let i = 1; i < age.length; i++) {
  if (age[i] > highest) {
    highest = age[i];
  }
}
console.log("Highest age:", highest);

