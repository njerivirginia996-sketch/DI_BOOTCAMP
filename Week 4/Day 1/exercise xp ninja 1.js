//exercise 1
const data = [
  { name: 'Butters', age: 3, type: 'dog' },
  { name: 'Cuty', age: 5, type: 'rabbit' },
  { name: 'Lizzy', age: 6, type: 'dog' },
  { name: 'Red', age: 1, type: 'cat' },
  { name: 'Joey', age: 3, type: 'dog' },
  { name: 'Rex', age: 10, type: 'dog' },
];

// 1. Using a loop
let totalDogYearsLoop = 0;
for (const animal of data) {
  if (animal.type === 'dog') {
    totalDogYearsLoop += animal.age * 7;
  }
}
console.log(totalDogYearsLoop); // 154

// 2. Using reduce()
const totalDogYearsReduce = data.reduce((sum, animal) => {
  return animal.type === 'dog' ? sum + animal.age * 7 : sum;
}, 0);
console.log(totalDogYearsReduce); // 154


//exercise 2
const userEmail3 = ' cannotfillemailformcorrectly@gmail.com ';

const cleanEmail = userEmail3.trim().replace(/\s+/g, '');

console.log(cleanEmail); // "cannotfillemailformcorrectly@gmail.com"


//exercise 3
const users = [
  { firstName: 'Bradley', lastName: 'Bouley', role: 'Full Stack Resident' },
  { firstName: 'Chloe', lastName: 'Alnaji', role: 'Full Stack Resident' },
  { firstName: 'Jonathan', lastName: 'Baughn', role: 'Enterprise Instructor' },
  { firstName: 'Michael', lastName: 'Herman', role: 'Lead Instructor' },
  { firstName: 'Robert', lastName: 'Hajek', role: 'Full Stack Resident' },
  { firstName: 'Wes', lastName: 'Reid', role: 'Instructor' },
  { firstName: 'Zach', lastName: 'Klabunde', role: 'Instructor' },
];

const usersObj = {};

users.forEach(({ firstName, lastName, role }) => {
  usersObj[`${firstName} ${lastName}`] = role;
});

console.log(usersObj);
/*
{
  'Bradley Bouley': 'Full Stack Resident',
  'Chloe Alnaji': 'Full Stack Resident',
  'Jonathan Baughn': 'Enterprise Instructor',
  'Michael Herman': 'Lead Instructor',
  'Robert Hajek': 'Full Stack Resident',
  'Wes Reid': 'Instructor',
  'Zach Klabunde': 'Instructor'
}
*/


//exercise 4
const letters = ['x', 'y', 'z', 'z'];

// 1. Using a for loop
const countLoop = {};
for (const letter of letters) {
  countLoop[letter] = (countLoop[letter] || 0) + 1;
}
console.log(countLoop); // { x: 1, y: 1, z: 2 }

// 2. Using reduce()
const countReduce = letters.reduce((acc, letter) => {
  acc[letter] = (acc[letter] || 0) + 1;
  return acc;
}, {});
console.log(countReduce); // { x: 1, y: 1, z: 2 }

