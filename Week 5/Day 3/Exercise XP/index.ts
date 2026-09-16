// ============================================
// Exercise 1: Class with Access Modifiers
// ============================================
class Employee {
  private name: string;
  private salary: number;
  public position: string;
  protected department: string;

  constructor(name: string, salary: number, position: string, department: string) {
    this.name = name;
    this.salary = salary;
    this.position = position;
    this.department = department;
  }

  public getEmployeeInfo(): string {
    return `${this.name} - ${this.position}`;
  }
}

const emp = new Employee("Alice", 75000, "Software Engineer", "Engineering");
console.log(emp.getEmployeeInfo()); // "Alice - Software Engineer"
console.log(emp.position);          // OK, public
// console.log(emp.salary);         // Error: 'salary' is private
// console.log(emp.department);     // Error: 'department' is protected


// ============================================
// Exercise 2: Readonly Properties in a Class
// ============================================
class Product {
  readonly id: number;
  public name: string;
  public price: number;

  constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  getProductInfo(): string {
    return `${this.name} costs $${this.price}`;
  }
}

const product = new Product(1, "Laptop", 999.99);
console.log(product.getProductInfo()); // "Laptop costs $999.99"
// product.id = 2; // Error: Cannot assign to 'id' because it is a read-only property.


// ============================================
// Exercise 3: Class Inheritance
// ============================================
class Animal {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  makeSound(): string {
    return "Some generic animal sound";
  }
}

class Dog extends Animal {
  makeSound(): string {
    return "bark";
  }
}

const dog = new Dog("Rex");
console.log(dog.makeSound()); // "bark"


// ============================================
// Exercise 4: Static Properties and Methods
// ============================================
class Calculator {
  static add(a: number, b: number): number {
    return a + b;
  }

  static subtract(a: number, b: number): number {
    return a - b;
  }
}

console.log(Calculator.add(5, 3));      // 8
console.log(Calculator.subtract(5, 3)); // 2


// ============================================
// Exercise 5: Extending Interfaces with
// Optional and Readonly Properties
// ============================================
interface User {
  readonly id: number;
  name: string;
  email: string;
}

interface PremiumUser extends User {
  membershipLevel?: string;
}

function printUserDetails(user: PremiumUser): void {
  console.log(`ID: ${user.id}`);
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Membership: ${user.membershipLevel ?? "Standard"}`);
}

const premiumUser: PremiumUser = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  membershipLevel: "Gold",
};

printUserDetails(premiumUser);