//exercise 1
const people = ["Greg", "Mary", "Devon", "James"];

// --- Part I - Review about arrays ---

// 1. Remove "Greg" from the people array
people.shift(); 
// Array is now: ["Mary", "Devon", "James"]

// 2. Replace "James" with "Jason"
people[2] = "Jason"; 
// Array is now: ["Mary", "Devon", "Jason"]

// 3. Add your name to the end of the people array
people.push("YourName"); 
// Array is now: ["Mary", "Devon", "Jason", "YourName"]

// 4. Console.log Mary's index
console.log(people.indexOf("Mary")); // Output: 0

// 5. Make a copy of the people array using slice (excluding "Mary" and "YourName")
// "Mary" is at index 0 and "YourName" is at index 3, so slice from index 1 to 3
const peopleCopy = people.slice(1, 3);
console.log(peopleCopy); // Output: ["Devon", "Jason"]

// 6. Give the index of "Foo"
console.log(people.indexOf("Foo")); // Output: -1
// Explanation: It returns -1 because "Foo" does NOT exist inside the `people` array. 
// JavaScript's indexOf method returns -1 whenever the element is not found.

// 7. Create a variable called `last` whose value is the last element of the array
const last = people[people.length - 1];
console.log(last); // Output: "YourName"


// --- Part II - Loops ---

// 1. Iterate through the people array and console.log each person
for (let i = 0; i < people.length; i++) {
  console.log(people[i]);
}

// 2. Iterate through the people array and exit the loop after logging "Devon"
for (let i = 0; i < people.length; i++) {
  console.log(people[i]);
  if (people[i] === "Devon") {
    break;
  }
}


//exercise 2
// 1. Create an array of five favorite colors
const colors = ["blue", "red", "green", "purple", "yellow"];

// 2. Loop through the array and print: "My #1 choice is blue", etc.
for (let i = 0; i < colors.length; i++) {
  console.log(`My #${i + 1} choice is ${colors[i]}`);
}

// ------------------------------------------
// 🌟 BONUS: Using correct number suffixes
// ------------------------------------------

// Create an array of suffixes matching indices 0 through 4
const suffixes = ["st", "nd", "rd", "th", "th"];

for (let i = 0; i < colors.length; i++) {
  const choiceNum = i + 1;
  const suffix = suffixes[i];
  console.log(`My ${choiceNum}${suffix} choice is ${colors[i]}`);
}


//exercise 3
// Variable to store the user's input
let number;

// A `do...while` loop is the most relevant choice here because it guarantees 
// the prompt runs at least once before checking if the number is smaller than 10.
do {
  const input = prompt("Please enter a number:");
  
  // Note: prompt() always returns a string (e.g., typeof input is "string").
  // We convert it to a number so we can perform numerical comparisons.
  number = Number(input);

} while (isNaN(number) || number < 10);

console.log(`Success! You entered ${number}, which is 10 or greater.`);


//exercise 4
const building = {
    numberOfFloors: 4,
    numberOfAptByFloor: {
        firstFloor: 3,
        secondFloor: 4,
        thirdFloor: 9,
        fourthFloor: 2,
    },
    nameOfTenants: ["Sarah", "Dan", "David"],
    numberOfRoomsAndRent:  {
        sarah: [3, 990],
        dan:  [4, 1000],
        david: [1, 500],
    },
};

// 1. Console.log the number of floors in the building
console.log(building.numberOfFloors); // Output: 4

// 2. Console.log how many apartments are on floors 1 and 3
console.log(
  building.numberOfAptByFloor.firstFloor + building.numberOfAptByFloor.thirdFloor
); // Output: 12 (3 + 9)

// 3. Console.log the name of the second tenant and the number of rooms he has
const secondTenant = building.nameOfTenants[1]; // "Dan"
const danRooms = building.numberOfRoomsAndRent.dan[0]; // 4 rooms
console.log(`${secondTenant} has ${danRooms} rooms.`);

// 4. Check rent sum and increase Dan's rent to 1200 if Sarah + David > Dan
const sarahRent = building.numberOfRoomsAndRent.sarah[1]; // 990
const davidRent = building.numberOfRoomsAndRent.david[1]; // 500
const danRent = building.numberOfRoomsAndRent.dan[1];     // 1000

if (sarahRent + davidRent > danRent) {
  building.numberOfRoomsAndRent.dan[1] = 1200;
}

console.log(building.numberOfRoomsAndRent.dan[1]); // Output: 1200


//exercise 5
let family = {
    father: "John",
    mother: "Mary",
    son: "David",
    daughter: "Sarah"
};

// Console.log the keys
for (let key in family) {
    console.log(key);
}

// Console.log the values
for (let key in family) {
    console.log(family[key]);
}



//exercise 6
const details = {
  my: 'name',
  is: 'Rudolf',
  the: 'reindeer'
};

let sentence = "";

for (let key in details) {
  sentence += key + " " + details[key] + " ";
}

console.log(sentence.trim());


//exercise 7
const names = ["Jack", "Philip", "Sarah", "Amanda", "Bernard", "Kyle"];

let societyName = "";

for (let name of names) {
    societyName += name[0];
}

societyName = societyName.split("").sort().join("");

console.log(societyName);