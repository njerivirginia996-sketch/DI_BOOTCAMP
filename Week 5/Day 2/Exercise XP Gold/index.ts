/* ============================================================
   🌟 Exercise 1: Union Types
   ============================================================ */
function processValue(value: string | number): string {
  if (typeof value === "number") {
    return `$${value.toFixed(2)}`;
  } else {
    return value.split("").reverse().join("");
  }
}

// Test the function
console.log(processValue(100));       // Output: $100.00
console.log(processValue(49.5));      // Output: $49.50
console.log(processValue("Alice"));   // Output: ecilA
console.log(processValue("TypeScript")); // Output: tpircSepyT


/* ============================================================
   🌟 Exercise 2: Array Type Annotations
   ============================================================ */
function sumNumbersInArray(arr: (number | string)[]): number {
  let sum = 0;
  for (const item of arr) {
    if (typeof item === "number") {
      sum += item;
    }
  }
  return sum;
}

// Test the function
console.log(sumNumbersInArray([1, 2, "three", 4, "five"])); // Output: 7
console.log(sumNumbersInArray(["a", "b", "c"]));             // Output: 0
console.log(sumNumbersInArray([10, 20, 30]));                // Output: 60


/* ============================================================
   🌟 Exercise 3: Type Aliases
   ============================================================ */
type AdvancedUser = {
  name: string;
  age: number;
  address?: string;
};

function introduceAdvancedUser(user: AdvancedUser): string {
  let greeting = `Hi, I'm ${user.name} and I'm ${user.age} years old.`;
  if (user.address) {
    greeting += ` I live at ${user.address}.`;
  }
  return greeting;
}

// Test the function
const userWithAddress: AdvancedUser = { name: "Alice", age: 25, address: "123 Main St" };
const userWithoutAddress: AdvancedUser = { name: "Bob", age: 30 };

console.log(introduceAdvancedUser(userWithAddress));
// Output: Hi, I'm Alice and I'm 25 years old. I live at 123 Main St.

console.log(introduceAdvancedUser(userWithoutAddress));
// Output: Hi, I'm Bob and I'm 30 years old.


/* ============================================================
   🌟 Exercise 4: Optional Parameters
   ============================================================ */
function welcomeUser(name: string, greeting?: string): string {
  const usedGreeting = greeting ?? "Hello";
  return `${usedGreeting}, ${name}!`;
}

// Test the function
console.log(welcomeUser("Alice"));               // Output: Hello, Alice!
console.log(welcomeUser("Bob", "Welcome back")); // Output: Welcome back, Bob!
