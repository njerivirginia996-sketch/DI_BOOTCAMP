#exercise 1
import math
class Circle:

    def __init__(self, radius=1.0):
        self.radius = radius

    def perimeter(self):
        """Computes and returns the perimeter (circumference) of the circle."""
        return 2 * math.pi * self.radius

    def area(self):
        """Computes and returns the area of the circle."""
        return math.pi * (self.radius**2)

    def definition(self):
        """Prints the geometrical definition of a circle."""
        print(
            "Geometrical Definition: A circle is a 2D shape consisting of all points "
            "in a plane that are at a given fixed distance (radius) from a given point (center)."
        )
# Example Usage:
# 1. Instantiating with default radius (1.0)
c1 = Circle()
print("Circle 1 Perimeter:", round(c1.perimeter(), 2))
print("Circle 1 Area:", round(c1.area(), 2))
c1.definition()

print("-" * 40)

# 2. Instantiating with a custom radius
c2 = Circle(5.0)
print("Circle 2 Perimeter:", round(c2.perimeter(), 2))
print("Circle 2 Area:", round(c2.area(), 2))

#exercise 2
import random
class MyList:

    def __init__(self, letters_list):
        self.letters = letters_list

    def get_reversed(self):
        """Returns the reversed list."""
        return list(reversed(self.letters))
        # Alternative: return self.letters[::-1]

    def get_sorted(self):
        """Returns the sorted list."""
        return sorted(self.letters)

    def generate_random_list(self):
        """Bonus: Generates a second list of the same length with random numbers (1-100)."""
        return [random.randint(1, 100) for _ in range(len(self.letters))]

# Example Usage:
my_letters = ["d", "a", "c", "b", "e"]
my_list_obj = MyList(my_letters)

print("Original List:", my_list_obj.letters)
print("Reversed List:", my_list_obj.get_reversed())
print("Sorted List:  ", my_list_obj.get_sorted())

# Testing Bonus Method
random_numbers = my_list_obj.generate_random_list()
print("Random List:  ", random_numbers)

#exercise 3
class MenuManager:

    def __init__(self):
        # Initial menu data represented as a list of dictionaries
        self.menu = [
            {"name": "Soup", "price": 10, "spice": "B", "gluten": False},
            {"name": "Hamburger", "price": 15, "spice": "A", "gluten": True},
            {"name": "Salad", "price": 18, "spice": "A", "gluten": False},
            {"name": "French Fries", "price": 5, "spice": "C", "gluten": False},
            {"name": "Beef bourguignon", "price": 25, "spice": "B", "gluten": True},
        ]

    def add_item(self, name, price, spice, gluten):
        """Adds a new dish to the menu."""
        new_dish = {
            "name": name,
            "price": price,
            "spice": spice,
            "gluten": gluten,
        }
        self.menu.append(new_dish)
        print(f"'{name}' has been added to the menu.")

    def update_item(self, name, price, spice, gluten):
        """Updates an existing dish in the menu if found."""
        for dish in self.menu:
            if dish["name"].lower() == name.lower():
                dish["price"] = price
                dish["spice"] = spice
                dish["gluten"] = gluten
                print(f"'{name}' has been updated successfully.")
                return

        print(f"Error: '{name}' is not in the menu.")

    def remove_item(self, name):
        """Removes a dish from the menu if found and prints the updated menu."""
        for dish in self.menu:
            if dish["name"].lower() == name.lower():
                self.menu.remove(dish)
                print(f"'{name}' has been removed from the menu.")
                print("Updated Menu:", self.menu)
                return

        print(f"Error: '{name}' is not in the menu.")


# Example Usage & Testing
if __name__ == "__main__":
    manager = MenuManager()

    # 1. Add a new item
    manager.add_item("Tacos", 12, "C", False)

    # 2. Update an existing item
    manager.update_item("Soup", 12, "B", False)

    # 3. Try to update an item that doesn't exist
    manager.update_item("Pizza", 20, "A", True)

    # 4. Remove an item
    manager.remove_item("French Fries")

    # 5. Try to remove an item that doesn't exist
    manager.remove_item("Ice Cream")