let client = "John";

const groceries = {
	fruits: ["pear", "apple", "banana"],
	vegetables: ["tomatoes", "cucumber", "salad"],
	totalPrice: "20$",
	other: {
		paid: true,
		meansOfPayment: ["cash", "creditCard"]
	}
};

const displayGroceries = () => {
	groceries.fruits.forEach((fruit) => console.log(fruit));
};

const cloneGroceries = () => {
	const user = client;
	client = "Betty";

	// user remains "John" because strings are primitive values copied by value.
	console.log("user:", user, "client:", client);

	const shopping = groceries;
	shopping.totalPrice = "35$";

	// shopping.totalPrice and groceries.totalPrice are both "35$" because objects are assigned by reference.
	console.log("groceries totalPrice:", groceries.totalPrice);
	console.log("shopping totalPrice:", shopping.totalPrice);

	shopping.other.paid = false;

	// shopping.other.paid and groceries.other.paid are both false for the same reference reason.
	console.log("groceries paid:", groceries.other.paid);
	console.log("shopping paid:", shopping.other.paid);
};

displayGroceries();
cloneGroceries();
