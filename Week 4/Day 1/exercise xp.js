//exercise 1
const colors = ["Blue", "Green", "Red", "Orange", "Violet", "Indigo", "Yellow"];

// 1. Display each color with its rank
colors.forEach((color, index) => {
  console.log(`${index + 1}# choice is ${color}.`);
});

// 2. Check if "Violet" is in the array
if (colors.includes("Violet")) {
  console.log("Yeah");
} else {
  console.log("No...");
}


//exercise 2
const ordinal = ["th", "st", "nd", "rd"];

colors.forEach((color, index) => {
  const rank = index + 1;
  const suffix = (rank % 100 >= 11 && rank % 100 <= 13) ? ordinal[0] : (ordinal[rank % 10] || ordinal[0]);
  console.log(`${rank}${suffix} choice is ${color}.`);
});


//exercise 3
const fruits = ["apple", "orange"];
const vegetables = ["carrot", "potato"];

const result = ['bread', ...vegetables, 'chicken', ...fruits];
console.log(result);


//exercise 4
const users = [{ firstName: 'Bradley', lastName: 'Bouley', role: 'Full Stack Resident' },
             { firstName: 'Chloe', lastName: 'Alnaji', role: 'Full Stack Resident' },
             { firstName: 'Jonathan', lastName: 'Baughn', role: 'Enterprise Instructor' },
             { firstName: 'Michael', lastName: 'Herman', role: 'Lead Instructor' },
             { firstName: 'Robert', lastName: 'Hajek', role: 'Full Stack Resident' },
             { firstName: 'Wes', lastName: 'Reid', role: 'Instructor'},
             { firstName: 'Zach', lastName: 'Klabunde', role: 'Instructor'}];

// 1. map() to build welcome messages
const welcomeStudents = users.map(user => `Hello ${user.firstName}`);
console.log(welcomeStudents);
// ["Hello Bradley", "Hello Chloe", "Hello Jonathan", "Hello Michael", "Hello Robert", "Hello Wes", "Hello Zach"]

// 2. filter() for Full Stack Residents
const fullStackResidents = users.filter(user => user.role === 'Full Stack Resident');
console.log(fullStackResidents);
// [{firstName: 'Bradley', ...}, {firstName: 'Chloe', ...}, {firstName: 'Robert', ...}]

// 3. Bonus: filter + map chained, get only lastNames
const fullStackLastNames = users
  .filter(user => user.role === 'Full Stack Resident')
  .map(user => user.lastName);
console.log(fullStackLastNames);
// ["Bouley", "Alnaji", "Hajek"]


//exercise 5
const epic = ['a', 'long', 'time', 'ago', 'in a', 'galaxy', 'far far', 'away'];

const sentence = epic.reduce((accumulator, current) => accumulator + ' ' + current);
console.log(sentence);
// "a long time ago in a galaxy far far away"


//exercise 6
const students = [{name: "Ray", course: "Computer Science", isPassed: true}, 
               {name: "Liam", course: "Computer Science", isPassed: false}, 
               {name: "Jenner", course: "Information Technology", isPassed: true}, 
               {name: "Marco", course: "Robotics", isPassed: true}, 
               {name: "Kimberly", course: "Artificial Intelligence", isPassed: false}, 
               {name: "Jamie", course: "Big Data", isPassed: false}];

// 1. filter() for students who passed
const passedStudents = students.filter(student => student.isPassed);
console.log(passedStudents);
// [{name: "Ray", ...}, {name: "Jenner", ...}, {name: "Marco", ...}]

// 2. Bonus: filter + forEach to congratulate them
students
  .filter(student => student.isPassed)
  .forEach(student => {
    console.log(`Good job ${student.name}, you passed the course in ${student.course}`);
  });