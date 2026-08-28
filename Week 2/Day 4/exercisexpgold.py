USER_MENU_TEXT = """
===== Restaurant Menu Manager =====
1. Show restaurant menu
2. Add item
3. Remove item
4. Exit
====================================
"""

import json
from pathlib import Path


class MenuManager:
    """Store menu items and save/load them from a JSON file."""

    FILE_PATH = Path(__file__).with_name("menu.json")

    def __init__(self):
        self.items = []
        if self.FILE_PATH.exists():
            try:
                data = json.loads(self.FILE_PATH.read_text(encoding="utf-8"))
                if isinstance(data, list):
                    self.items = data
            except (OSError, json.JSONDecodeError):
                pass

    def get_items(self):
        return self.items

    def add_item(self, name, price):
        self.items.append({"name": name, "price": price})

    def remove_item(self, name):
        for index, item in enumerate(self.items):
            if item.get("name") == name:
                self.items.pop(index)
                return True
        return False

    def save_to_file(self):
        self.FILE_PATH.write_text(
            json.dumps(self.items, indent=2), encoding="utf-8"
        )


def load_manager():
    """Create and return a new MenuManager instance."""
    return MenuManager()


def show_restaurant_menu(manager):
    """Print the restaurant's menu (name + price of every item)."""
    items = manager.get_items()

    if not items:
        print("\nThe menu is currently empty.\n")
        return

    print("\n----- Restaurant Menu -----")
    for item in items:
        print(f"{item['name']:<20} ${item['price']:.2f}")
    print("----------------------------\n")


def add_item_to_menu(manager):
    """Ask the user for a name/price and add it via the MenuManager."""
    name = input("Enter the item's name: ").strip()

    while True:
        price_input = input("Enter the item's price: ").strip()
        try:
            price = float(price_input)
            break
        except ValueError:
            print("Please enter a valid number for the price.")

    manager.add_item(name, price)
    print("item was added successfully")


def remove_item_from_menu(manager):
    """Ask the user for a name and remove it via the MenuManager."""
    name = input("Enter the name of the item to remove: ").strip()

    if manager.remove_item(name):
        print(f"'{name}' was removed successfully.")
    else:
        print(f"Error: '{name}' was not found in the menu.")


def show_user_menu():
    """Display the program's menu and return the user's chosen option."""
    print(USER_MENU_TEXT)
    return input("Choose an option (1-4): ").strip()


def main():
    manager = load_manager()

    while True:
        choice = show_user_menu()

        if choice == "1":
            show_restaurant_menu(manager)
        elif choice == "2":
            add_item_to_menu(manager)
        elif choice == "3":
            remove_item_from_menu(manager)
        elif choice == "4":
            manager.save_to_file()
            print("Menu was saved. Goodbye!")
            break
        else:
            print("Invalid option, please choose a number between 1 and 4.")


if __name__ == "__main__":
    main()