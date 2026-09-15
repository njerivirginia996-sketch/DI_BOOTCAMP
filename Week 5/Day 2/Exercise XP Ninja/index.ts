/* ============================================================
   🌟 Exercise 1: Conditional Types
   ============================================================ */
type MappedType<T> = T extends number ? number : T extends string ? number : never;

function mapType<T extends number | string>(value: T): MappedType<T> {
  if (typeof value === "number") {
    return (value * value) as MappedType<T>;
  } else {
    return (value as string).length as MappedType<T>;
  }
}

// Test the function
console.log(mapType(5));           // Output: 25
console.log(mapType("hello"));     // Output: 5
console.log(mapType(10));          // Output: 100
console.log(mapType("TypeScript")); // Output: 10


/* ============================================================
   🌟 Exercise 2: Keyof and Lookup Types
   ============================================================ */
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Test the function
const user = { name: "Alice", age: 25, isAdmin: true };

console.log(getProperty(user, "name"));    // Output: Alice
console.log(getProperty(user, "age"));     // Output: 25
console.log(getProperty(user, "isAdmin")); // Output: true


/* ============================================================
   🌟 Exercise 3: Using Interfaces with Numeric Properties
   ============================================================ */
interface HasNumericProperty {
  [key: string]: number;
}

function multiplyProperty(
  obj: HasNumericProperty,
  key: string,
  factor: number
): number {
  return obj[key] * factor;
}

// Test the function
const dimensions = { width: 10, height: 20, depth: 5 };

console.log(multiplyProperty(dimensions, "width", 2));  // Output: 20
console.log(multiplyProperty(dimensions, "height", 3)); // Output: 60
console.log(multiplyProperty(dimensions, "depth", 4));   // Output: 20