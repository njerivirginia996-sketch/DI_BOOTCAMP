#exercise 1
birthdays = {
    "Virgie Njeri": "2000/03/14",
    "Linny Kavera": "2001/12/10",
    "Seth Rawlins": "1999/06/23",
    "Mukenyi Lee": "2002/11/07",
    "Gracious Tender": "2003/12/09",
}
print("Welcome to the Birthday Lookup Program!")
print("You can look up the birthdays of the people in the list!\n")
print("People in list:")
for name in birthdays:
    print(f"- {name}")
print()
user_choice = input("Enter a person's name: ").strip()
if user_choice in birthdays:
    print(f"\n{user_choice}'s birthday is on {birthdays[user_choice]}.")
else:
    print(f"\nSorry, {user_choice} is not in the list.")
    
#exercise 2
birthdays = {
        "Virgie Njeri": "2000/03/14",
        "Linny Kavera": "2001/12/10",
        "Seth Rawlins": "1999/06/23",
        "Mukenyi Lee": "2002/11/07",
        "Gracious Tender": "2003/12/09",
    
}
print("Welcome to the Birthday Lookup Program!")
print("You can look up the birthdays of the people in the list!\n")
print("Available names:")
for name in birthdays.keys():
    print(f"- {name}")
print()
user_choice = input("Enter a person's name: ").strip()
if user_choice in birthdays:
    print(f"\n{user_choice}'s birthday is on {birthdays[user_choice]}.")
else:
    print(f"\nSorry, we don’t have the birthday information for {user_choice}")
    
#exercise 3
# Initialize the birthdays dictionary
birthdays = {
    "Albert Einstein": "1879/03/14",
    "Ada Lovelace": "1815/12/10",
    "Alan Turing": "1912/06/23",
    "Marie Curie": "1867/11/07",
    "Grace Hopper": "1906/12/09",
}

print("Welcome to the Birthday Lookup Program!\n")

# 1. Ask the user to add a new person and birthday
print("--- Add a New Birthday ---")
new_name = input("Enter a person's name to add: ").strip()
new_birthday = input(f"Enter {new_name}'s birthday (YYYY/MM/DD): ").strip()

# Add the new entry to the dictionary
birthdays[new_name] = new_birthday
print(f"Successfully added {new_name} to the list!\n")

# 2. Print out all of the names in the dictionary (including the newly added one)
print("Available names:")
for name in birthdays.keys():
    print(f"- {name}")
print()

# 3. Prompt user for lookup input
user_choice = input("Enter a person's name to look up: ").strip()

# 4. Check dictionary and display result or error message
if user_choice in birthdays:
    print(f"\n{user_choice}'s birthday is on {birthdays[user_choice]}.")
else:
    print(f"\nSorry, we don’t have the birthday information for {user_choice}")
    
#exercise 4
# Part 1: Simple dictionary printing
items = {"banana": 4, "apple": 2, "orange": 1.5, "pear": 3}
print("--- Item Prices ---")
for item, price in items.items():
    print(f"The price of a {item} is ${price}.")
print("\n" + "=" * 40 + "\n")
# Part 2: Nested dictionary stock calculation
items_stock = {
    "banana": {"price": 4, "stock": 10},
    "apple": {"price": 2, "stock": 5},
    "orange": {"price": 1.5, "stock": 24},
    "pear": {"price": 3, "stock": 1},
}
total_inventory_cost = 0
for item, details in items_stock.items():
    item_total = details["price"] * details["stock"]
    total_inventory_cost += item_total
print(f"Total cost to buy everything in stock: ${total_inventory_cost:.2f}")