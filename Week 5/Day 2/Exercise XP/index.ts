export {};

/* ============================================================
   🌟 Exercise 1: Hello, World! Program
   ============================================================ */
console.log("Hello, World!");


/* ============================================================
   🌟 Exercise 2: Type Annotations
   ============================================================ */
const age: number = 25;
const name: string = "Alice";
console.log(age);
console.log(name);


/* ============================================================
   🌟 Exercise 3: Union Types
   ============================================================ */
let id: string | number;

id = 101;
console.log(id);

id = "A101";
console.log(id);


/* ============================================================
   🌟 Exercise 4: Control Flow with if...else
   ============================================================ */
function checkNumber(num: number): string {
  if (num > 0) {
    return "Positive";
  } else if (num < 0) {
    return "Negative";
  } else {
    return "Zero";
  }
}

console.log(checkNumber(5));   // Output: Positive
console.log(checkNumber(-3));  // Output: Negative
console.log(checkNumber(0));   // Output: Zero


/* ============================================================
   🌟 Exercise 5: Tuple Types
   ============================================================ */
function getDetails(name: string, age: number): [string, number, string] {
  const greeting = `Hello, ${name}! You are ${age} years old.`;
  return [name, age, greeting];
}

const details = getDetails("Alice", 25);
console.log(details); // Output: ['Alice', 25, 'Hello, Alice! You are 25 years old.']


/* ============================================================
   🌟 Exercise 6: Object Type Annotations
   ============================================================ */
type Person = {
  name: string;
  age: number;
};

function createPerson(name: string, age: number): Person {
  return { name, age };
}

const person = createPerson("Bob", 30);
console.log(person); // Output: { name: 'Bob', age: 30 }


/* ============================================================
   🌟 Exercise 7: Type Assertions
   ============================================================ */
// Assumes an <input id="username"> element exists in the HTML
if (typeof document !== "undefined") {
  const inputElement = document.getElementById("username") as HTMLInputElement | null;

  if (inputElement) {
    inputElement.value = "New Username";
    console.log(inputElement.value); // Output: New Username
  }
}


/* ============================================================
   🌟 Exercise 8: switch Statement with Complex Conditions
   ============================================================ */
function getAction(role: string): string {
  switch (role) {
    case "admin":
      return "Manage users and settings";
    case "editor":
      return "Edit content";
    case "viewer":
      return "View content";
    case "guest":
      return "Limited access";
    default:
      return "Invalid role";
  }
}

console.log(getAction("admin"));   // Output: Manage users and settings
console.log(getAction("editor"));  // Output: Edit content
console.log(getAction("viewer"));  // Output: View content
console.log(getAction("guest"));   // Output: Limited access
console.log(getAction("unknown")); // Output: Invalid role


/* ============================================================
   🌟 Exercise 9: Function Overloading with Default Parameters
   ============================================================ */
function greet(name: string): string;
function greet(): string;
function greet(name?: string): string {
  if (name) {
    return `Hello, ${name}! Welcome!`;
  }
  return "Hello there! Welcome!";
}

console.log(greet("Alice")); // Output: Hello, Alice! Welcome!
console.log(greet());        // Output: Hello there! Welcome!