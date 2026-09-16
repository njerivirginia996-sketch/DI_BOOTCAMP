// ============================================
// Exercise 1: Class Inheritance with
// Protected Access Modifiers
// ============================================
class EmployeeGold {
  protected name: string;
  protected salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }

  getDetails(): string {
    return `Name: ${this.name}, Salary: $${this.salary}`;
  }
}

class Manager extends EmployeeGold {
  public department: string;

  constructor(name: string, salary: number, department: string) {
    super(name, salary);
    this.department = department;
  }

  override getDetails(): string {
    return `${super.getDetails()}, Department: ${this.department}`;
  }
}

const manager = new Manager("Sarah", 95000, "Engineering");
console.log(manager.getDetails());
// "Name: Sarah, Salary: $95000, Department: Engineering"


// ============================================
// Exercise 2: Using Readonly with
// Access Modifiers
// ============================================
class Car {
  public readonly make: string;
  private readonly model: string;
  public year: number;

  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }

  getCarDetails(): string {
    return `${this.year} ${this.make} ${this.model}`;
  }
}

const car = new Car("Toyota", "Corolla", 2023);
console.log(car.getCarDetails()); // "2023 Toyota Corolla"

// car.make = "Honda";
// Error: Cannot assign to 'make' because it is a read-only property.

// car.model = "Civic";
// Error: Property 'model' is private and only accessible within class 'Car'.
// (also a readonly error if accessed from inside the class)


// ============================================
// Exercise 3: Static Properties and
// Methods in Classes
// ============================================
class MathUtils {
  static PI: number = 3.14159;

  static circumference(radius: number): number {
    return 2 * MathUtils.PI * radius;
  }
}

console.log(MathUtils.circumference(5)); // 31.4159
console.log(MathUtils.PI);               // 3.14159


// ============================================
// Exercise 4: Interface with Function Types
// ============================================
interface Operation {
  execute(a: number, b: number): number;
}

class Addition implements Operation {
  execute(a: number, b: number): number {
    return a + b;
  }
}

class Multiplication implements Operation {
  execute(a: number, b: number): number {
    return a * b;
  }
}

const addition = new Addition();
const multiplication = new Multiplication();

console.log(addition.execute(4, 6));       // 10
console.log(multiplication.execute(4, 6)); // 24


// ============================================
// Exercise 5: Extending Interfaces with
// Optional and Readonly Properties
// ============================================
interface Shape {
  color: string;
  getArea(): number;
}

interface RectangleShape extends Shape {
  readonly width: number;
  readonly height: number;
  getPerimeter(): number;
}

class Rectangle implements RectangleShape {
  color: string;
  readonly width: number;
  readonly height: number;

  constructor(color: string, width: number, height: number) {
    this.color = color;
    this.width = width;
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const rect = new Rectangle("blue", 10, 5);
console.log(`Area: ${rect.getArea()}`);           // "Area: 50"
console.log(`Perimeter: ${rect.getPerimeter()}`); // "Perimeter: 30"