//exercise 1
function printFullName({ first, last }) {
    return `Your full name is ${first} ${last}`;
}

console.log(printFullName({ first: 'Elie', last: 'Schoppik' }));
// 'Your full name is Elie Schoppik'


//exercise 2
function keysAndValues(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const sortedValues = sortedKeys.map(key => obj[key]);
    return [sortedKeys, sortedValues];
}

console.log(keysAndValues({ a: 1, b: 2, c: 3 }));
// [["a", "b", "c"], [1, 2, 3]]

console.log(keysAndValues({ a: "Apple", b: "Microsoft", c: "Google" }));
// [["a", "b", "c"], ["Apple", "Microsoft", "Google"]]

console.log(keysAndValues({ key1: true, key2: false, key3: undefined }));
// [["key1", "key2", "key3"], [true, false, undefined]]


//exercise 3
class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
  }
}

const counterOne = new Counter();
counterOne.increment();
counterOne.increment();

const counterTwo = counterOne;
counterTwo.increment();

console.log(counterOne.count);
//Output:
//3