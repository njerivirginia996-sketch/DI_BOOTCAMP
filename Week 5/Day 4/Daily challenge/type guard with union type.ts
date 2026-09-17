// ============================================================
// Daily Challenge: Type Guard with Union Types
// ============================================================

type User = {
  type: "user";
  name: string;
  age: number;
};

type Product = {
  type: "product";
  id: number;
  price: number;
};

type Order = {
  type: "order";
  orderId: string;
  amount: number;
};

type DataItem = User | Product | Order;

function handleData(items: DataItem[]): string[] {
  return items.map((item) => {
    switch (item.type) {
      case "user":
        // narrowed to User
        return `Hello, ${item.name}! You are ${item.age} years old.`;

      case "product":
        // narrowed to Product
        return `Product #${item.id} costs $${item.price}.`;

      case "order":
        // narrowed to Order
        return `Order ${item.orderId} totals $${item.amount}.`;

      default:
        // Exhaustiveness check: if a new type is added to DataItem
        // and not handled above, this line will fail to compile.
        const _exhaustiveCheck: never = item;
        return `Unknown item: ${JSON.stringify(_exhaustiveCheck)}`;
    }
  });
}

const mixedData: DataItem[] = [
  { type: "user", name: "Alice", age: 30 },
  { type: "product", id: 101, price: 49.99 },
  { type: "order", orderId: "ORD-001", amount: 149.99 },
  { type: "user", name: "Bob", age: 25 },
];

const results = handleData(mixedData);
results.forEach((r) => console.log(r));

// Output:
// Hello, Alice! You are 30 years old.
// Product #101 costs $49.99.
// Order ORD-001 totals $149.99.
// Hello, Bob! You are 25 years old.