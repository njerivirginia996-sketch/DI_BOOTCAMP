// ============================================================
// Exercise 1: Combining Intersection Types with Type Guards
// ============================================================
interface User {
  name: string;
  email: string;
}

interface Admin {
  adminLevel: number;
}

type AdminUser = User & Admin;

function getProperty(obj: AdminUser, propName: string): unknown {
  if (propName in obj) {
    return obj[propName as keyof AdminUser];
  }
  return undefined;
}

const adminUser: AdminUser = {
  name: "Grace",
  email: "grace@example.com",
  adminLevel: 3,
};

console.log("Exercise 1:", getProperty(adminUser, "name"));       // "Grace"
console.log("Exercise 1:", getProperty(adminUser, "adminLevel")); // 3
console.log("Exercise 1:", getProperty(adminUser, "nonExistent")); // undefined


// ============================================================
// Exercise 2: Type Casting with Generics
// ============================================================
function castToType<T>(value: any, constructorFn: (value: any) => T): T {
  return constructorFn(value);
}

const numFromString = castToType("42", Number);
const boolFromString = castToType("true", (v: string) => v === "true");

console.log("Exercise 2:", numFromString, typeof numFromString);   // 42 "number"
console.log("Exercise 2:", boolFromString, typeof boolFromString); // true "boolean"


// ============================================================
// Exercise 3: Type Assertions with Generic Constraints
// ============================================================
function getArrayLength<T extends number | string>(items: T[]): number {
  return (items as (number | string)[]).length;
}

console.log("Exercise 3:", getArrayLength([1, 2, 3, 4]));       // 4
console.log("Exercise 3:", getArrayLength(["a", "b", "c"]));    // 3
// getArrayLength([true, false]); // ❌ Error: boolean not allowed by constraint


// ============================================================
// Exercise 4: Generic Interfaces with Class Implementation
// ============================================================
interface ItemStorage<T> {
  add(item: T): void;
  get(index: number): T | undefined;
}

class Box<T> implements ItemStorage<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }
}

const numberBox = new Box<number>();
numberBox.add(10);
numberBox.add(20);
console.log("Exercise 4:", numberBox.get(0), numberBox.get(1)); // 10 20

const stringBox = new Box<string>();
stringBox.add("hello");
stringBox.add("world");
console.log("Exercise 4:", stringBox.get(0), stringBox.get(1)); // "hello" "world"


// ============================================================
// Exercise 5: Combining Generic Classes with Constraints
// ============================================================
interface Item<T> {
  value: T;
}

class Queue<T> {
  private items: Item<T>[] = [];

  add(item: Item<T>): void {
    this.items.push(item);
  }

  remove(): Item<T> | undefined {
    return this.items.shift();
  }
}

const numberQueue = new Queue<number>();
numberQueue.add({ value: 1 });
numberQueue.add({ value: 2 });
console.log("Exercise 5:", numberQueue.remove()); // { value: 1 }
console.log("Exercise 5:", numberQueue.remove()); // { value: 2 }

const stringQueue = new Queue<string>();
stringQueue.add({ value: "first" });
stringQueue.add({ value: "second" });
console.log("Exercise 5:", stringQueue.remove()); // { value: "first" }
console.log("Exercise 5:", stringQueue.remove()); // { value: "second" }