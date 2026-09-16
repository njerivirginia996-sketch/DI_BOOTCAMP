export {};

// ============================================
// Exercise 1: Advanced Access Modifiers
// and Inheritance
// ============================================
class Employee {
  public name: string;
  private age: number;
  protected salary: number;

  constructor(name: string, age: number, salary: number) {
    this.name = name;
    this.age = age;
    this.salary = salary;
  }

  protected calculateBonus(): number {
    return this.salary * 0.1;
  }

  getSalaryDetails(): string {
    return `${this.name}'s salary: $${this.salary}`;
  }
}

class Manager extends Employee {
  override getSalaryDetails(): string {
    const bonus = this.calculateBonus();
    return `${this.name}'s salary: $${this.salary} (Bonus: $${bonus})`;
  }
}

class ExecutiveManager extends Manager {
  approveBudget(amount: number): string {
    return `${this.name} approved a budget of $${amount}`;
  }
}

const exec = new ExecutiveManager("Diane", 45, 150000);
console.log(exec.getSalaryDetails());       // "Diane's salary: $150000 (Bonus: $15000)"
console.log(exec.approveBudget(50000));     // "Diane approved a budget of $50000"
console.log(exec.name);                     // OK, public
// console.log(exec.age);                   // Error: private, only inside Employee
// console.log(exec.salary);                // Error: protected, only inside class hierarchy
// exec.calculateBonus();                   // Error: protected method


// ============================================
// Exercise 2: Advanced Static Methods
// and Properties
// ============================================
class Shape {
  static totalShapes: number = 0;

  constructor() {
    Shape.totalShapes++;
  }

  static getType(): string {
    return "Generic Shape";
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }

  static override getType(): string {
    return "Circle";
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Square extends Shape {
  constructor(public side: number) {
    super();
  }

  static override getType(): string {
    return "Square";
  }

  area(): number {
    return this.side ** 2;
  }
}

const circle = new Circle(4);
const square = new Square(3);

console.log(Circle.getType());       // "Circle"
console.log(Square.getType());       // "Square"
console.log(circle.area().toFixed(2)); // "50.27"
console.log(square.area());          // 9
console.log(Shape.totalShapes);      // 2


// ============================================
// Exercise 3: Complex Interfaces with
// Function Types
// ============================================
interface Calculator {
  a: number;
  b: number;
  operate(fn: (x: number, y: number) => number): number;
}

class AdvancedCalculator implements Calculator {
  a: number;
  b: number;

  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }

  operate(fn: (x: number, y: number) => number): number {
    return fn(this.a, this.b);
  }
}

const calc = new AdvancedCalculator(10, 5);
console.log(calc.operate((x, y) => x + y)); // 15 (add)
console.log(calc.operate((x, y) => x - y)); // 5  (subtract)
console.log(calc.operate((x, y) => x * y)); // 50 (multiply)


// ============================================
// Exercise 4: Readonly Properties in
// Complex Inheritance
// ============================================
class Device {
  readonly serialNumber: string;

  constructor(serialNumber: string) {
    this.serialNumber = serialNumber;
  }

  getDeviceInfo(): string {
    return `Serial Number: ${this.serialNumber}`;
  }
}

class Laptop extends Device {
  model: string;
  price: number;

  constructor(serialNumber: string, model: string, price: number) {
    super(serialNumber);
    this.model = model;
    this.price = price;
  }

  override getDeviceInfo(): string {
    return `${super.getDeviceInfo()}, Model: ${this.model}, Price: $${this.price}`;
  }
}

const laptop = new Laptop("SN-12345", "ThinkPad X1", 1800);
console.log(laptop.getDeviceInfo());
// "Serial Number: SN-12345, Model: ThinkPad X1, Price: $1800"

laptop.model = "ThinkPad X1 Carbon"; // OK
laptop.price = 1950;                  // OK
// laptop.serialNumber = "SN-99999";  // Error: readonly property


// ============================================
// Exercise 5: Extending Multiple Interfaces
// with Optional and Readonly Properties
// ============================================
interface Product {
  readonly name: string;
  price: number;
  discount?: number;
}

interface Electronics extends Product {
  warrantyPeriod: string;
}

class Smartphone implements Electronics {
  readonly name: string;
  price: number;
  discount?: number;
  warrantyPeriod: string;

  constructor(name: string, price: number, warrantyPeriod: string, discount?: number) {
    this.name = name;
    this.price = price;
    this.warrantyPeriod = warrantyPeriod;
    this.discount = discount;
  }

  getFinalPrice(): number {
    if (this.discount) {
      return this.price - this.price * (this.discount / 100);
    }
    return this.price;
  }
}

const phone = new Smartphone("iPhone 16", 999, "1 Year", 10);
console.log(`Final Price: $${phone.getFinalPrice()}`); // "Final Price: $899.1"

// phone.name = "Galaxy S25"; // Error: readonly property

const phoneNoDiscount = new Smartphone("Pixel 9", 799, "2 Years");
console.log(`Final Price: $${phoneNoDiscount.getFinalPrice()}`); // "Final Price: $799"