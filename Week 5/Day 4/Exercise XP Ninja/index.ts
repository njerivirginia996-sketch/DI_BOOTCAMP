// ============================================================
// Exercise 1: TypeScript Generics and Intersection Types
// ============================================================
interface Identifiable {
  id: number;
}

interface Timestamped {
  createdAt: Date;
}

// Items managed by the container must have both an id and a createdAt
type ManagedItem = Identifiable & Timestamped;

class Container<T extends ManagedItem> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(id: number): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  list(): T[] {
    return [...this.items];
  }
}

type Task = ManagedItem & { title: string };

const taskContainer = new Container<Task>();

taskContainer.add({ id: 1, title: "Write exercises", createdAt: new Date() });
taskContainer.add({ id: 2, title: "Review PR", createdAt: new Date() });

console.log("Exercise 1:", taskContainer.list());

taskContainer.remove(1);
console.log("Exercise 1 (after remove):", taskContainer.list());


// ============================================================
// Exercise 2: Generic Interfaces and Type Casting
// ============================================================
interface ApiResponse<T> {
  status: number;
  data: T;
}

function parseResponse<T>(
  rawResponse: { status: number; data: unknown },
  isValidData: (data: unknown) => data is T,
): ApiResponse<T> {
  if (!isValidData(rawResponse.data)) {
    throw new TypeError("API response data has an invalid shape");
  }

  return {
    status: rawResponse.status,
    data: rawResponse.data,
  };
}

interface UserData {
  name: string;
  age: number;
}

const rawApiResponse = {
  status: 200,
  data: { name: "Alice", age: 30 },
};

const isUserData = (data: unknown): data is UserData => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const userData = data as Record<string, unknown>;
  return typeof userData.name === "string" && typeof userData.age === "number";
};

const typedResponse = parseResponse<UserData>(rawApiResponse, isUserData);

console.log("Exercise 2:", typedResponse.status);        // 200
console.log("Exercise 2:", typedResponse.data.name);      // "Alice"
console.log("Exercise 2:", typedResponse.data.age);       // 30


// ============================================================
// Exercise 3: Generic Classes and Type Assertions
// ============================================================
class Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getById(index: number): T | undefined {
    if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
      return undefined;
    }

    return this.items[index];
  }

  list(): T[] {
    return [...this.items];
  }
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const productRepo = new Repository<Product>();

productRepo.add({ id: 1, name: "Laptop", price: 1200 });
productRepo.add({ id: 2, name: "Mouse", price: 25 });

console.log("Exercise 3:", productRepo.getById(0)); // { id: 1, name: "Laptop", price: 1200 }
console.log("Exercise 3:", productRepo.list());