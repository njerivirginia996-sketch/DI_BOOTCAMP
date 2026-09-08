//exercise 1
const person = {
    name: 'John Doe',
    age: 25,
    location: {
        country: 'Canada',
        city: 'Vancouver',
        coordinates: [49.2827, -123.1207]
    }
}

const {name, location: {country, city, coordinates: [lat, lng]}} = person;

console.log(`I am ${name} from ${city}, ${country}. Latitude(${lat}), Longitude(${lng})`);
//I am John Doe from Vancouver, Canada. Latitude(49.2827), Longitude(-123.1207)


//exercise 2
function displayStudentInfo({ first, last }) {
    return `Your full name is ${first} ${last}`;
}

console.log(displayStudentInfo({ first: 'Elie', last: 'Schoppik' }));
// output: 'Your full name is Elie Schoppik'


//exercise 3
const users = { user1: 18273, user2: 92833, user3: 90315 };

// Part 1
const usersArray = Object.entries(users);
console.log(usersArray);
// [ [ 'user1', 18273 ], [ 'user2', 92833 ], [ 'user3', 90315 ] ]

// Part 2
const doubledIds = usersArray.map(([name, id]) => [name, id * 2]);
console.log(doubledIds);
// [ [ 'user1', 36546 ], [ 'user2', 185666 ], [ 'user3', 180630 ] ]


//exercise 4
class Person {
  constructor(name) {
    this.name = name;
  }
}

const member = new Person('John');
console.log(typeof member);
//object


//exercise 5 #2
class Labrador extends Dog {
  constructor(name, size) {
    super(name);
    this.size = size;
  }
}


//exercise 6
//part 1
//[2] === [2]  Output: // false
//{} === {}    Output: // false

//part 2
const object1 = { number: 5 };
const object2 = object1;
const object3 = object2;
const object4 = { number: 5 };

object1.number = 4;
console.log(object2.number); //Output: // 4
console.log(object3.number); //Output: // 4
console.log(object4.number); //Output: // 5

//part 3
class Animal {
  constructor(name, type, color) {
    this.name = name;
    this.type = type;
    this.color = color;
  }
}

class Mammal extends Animal {
  constructor(name, type, color) {
    super(name, type, color);
  }

  sound(noise) {
    return `${noise} I'm a ${this.type}, named ${this.name} and I'm ${this.color}`;
  }
}

const farmerCow = new Mammal('Lily', 'cow', 'brown and white');
console.log(farmerCow.sound('Moooo'));
//Output: // Moooo I'm a cow, named Lily and I'm brown and white
