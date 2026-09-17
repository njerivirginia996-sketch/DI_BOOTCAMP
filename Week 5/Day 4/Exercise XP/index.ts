// ============================================================
// Exercise 1: Intersection Types
// ============================================================
type Person = {
  name: string;
  age: number;
};

type Address = {
  street: string;
  city: string;
};

type PersonWithAddress = Person & Address;

const personWithAddress: PersonWithAddress = {
  name: "Alice",
  age: 30,
  street: "123 Main St",
  city: "Nairobi",
};

console.log("Exercise 1:", personWithAddress);


// ============================================================
// Exercise 2: Type Guards with Union Types
// ============================================================
function describeValue(value: number | string): string {
  if (typeof value === "number") {
    return "This is a number";
  } else {
    return "This is a string";
  }
}

console.log("Exercise 2:", describeValue(42));
console.log("Exercise 2:", describeValue("hello"));


// ============================================================
// Exercise 3: Type Casting
// ============================================================
let someValue: any = "Hello, TypeScript!";
let strLength: number = (someValue as string).length;

console.log("Exercise 3:", strLength);
console.log("Exercise 3:", (someValue as string).toUpperCase());


// ============================================================
// Exercise 4: Type Assertions with Union Types
// ============================================================
function getFirstElement(arr: (number | string)[]): string {
  return arr[0] as string;
}

console.log("Exercise 4:", getFirstElement(["a", "b", "c"]));
console.log("Exercise 4:", getFirstElement([1, 2, 3])); // still a number at runtime


// ============================================================
// Exercise 5: Generic Constraints
// ============================================================
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(`Exercise 5: Length: ${item.length}`);
}

logLength("Hello");
logLength([1, 2, 3, 4]);
logLength({ length: 10 });
// logLength(42); // Error: number doesn't have a 'length' property


// ============================================================
// Exercise 6: Intersection Types and Type Guards
// ============================================================
type Job = {
  position: string;
  department: string;
};

type Manager = Job & { position: "Manager"; teamSize: number };
type Developer = Job & { position: "Developer"; primaryLanguage: string };

type Employee = Person & (Manager | Developer);

function describeEmployee(employee: Employee): string {
  if (employee.position === "Manager") {
    return `${employee.name} manages a team of ${employee.teamSize} in ${employee.department}.`;
  } else {
    return `${employee.name} is a Developer working with ${employee.primaryLanguage} in ${employee.department}.`;
  }
}

const manager: Employee = {
  name: "Grace",
  age: 40,
  position: "Manager",
  department: "Engineering",
  teamSize: 8,
};

const developer: Employee = {
  name: "Sam",
  age: 28,
  position: "Developer",
  department: "Engineering",
  primaryLanguage: "TypeScript",
};

console.log("Exercise 6:", describeEmployee(manager));
console.log("Exercise 6:", describeEmployee(developer));


// ============================================================
// Exercise 7: Type Assertions and Generic Constraints
// ============================================================
interface HasToString {
  toString(): string;
}

function formatInput<T extends HasToString>(input: T): string {
  const result = input.toString() as string;
  return `Formatted: ${result}`;
}

console.log("Exercise 7:", formatInput(123));
console.log("Exercise 7:", formatInput("hello"));
console.log("Exercise 7:", formatInput(true));
console.log("Exercise 7:", formatInput({ toString: () => "custom object" }));