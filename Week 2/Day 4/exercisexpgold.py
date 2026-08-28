#exercise 1
"""
menu_editor.py

Handles the user interface (UI) for the restaurant menu manager program:
- Showing the program's menu
- Getting user input
- Printing feedback / the restaurant menu

This file has no idea how the menu is stored (JSON file, database, etc.) -
it only ever calls methods on a MenuManager object. That's the
encapsulation the exercise asks for: swap out menu_manager.py's internals
completely and this file wouldn't need to change.
"""

from menu_manager import MenuManager

USER_MENU_TEXT = """
===== Restaurant Menu Manager =====
1. Show restaurant menu
2. Add item
3. Remove item
4. Exit
====================================
"""


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