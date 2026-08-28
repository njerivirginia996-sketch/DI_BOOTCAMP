from menu_manager import MenuManager

def load_manager():
    return MenuManager()

def add_item_to_menu(manager):
    name = input("Enter item name: ").strip()
    try:
        price = float(input("Enter item price: "))
        manager.add_item(name, price)
        print("item was added successfully.")
    except ValueError:
        print("Error: Please enter a valid number for the price.")

def remove_item_from_menu(manager):
    name = input("Enter item name to remove: ").strip()
    if manager.remove_item(name):
        print(f"'{name}' was deleted successfully.")
    else:
        print("Error: Item was not found in the menu.")

def show_restaurant_menu(manager):
    print("\n--- RESTAURANT MENU ---")
    for item in manager.menu["items"]:
        print(f"{item['name']}: ${item['price']}")
    print("------------------------")

def show_user_menu(manager):
    while True:
        print("\n*** Exercise Menu Manager ***")
        print("(v) View Menu")
        print("(a) Add an Item")
        print("(d) Delete an Item")
        print("(x) Exit")
        
        user_choice = input("Please select an option: ").strip().lower()

        if user_choice == 'v':
            show_restaurant_menu(manager)
        elif user_choice == 'a':
            add_item_to_menu(manager)
        elif user_choice == 'd':
            remove_item_from_menu(manager)
        elif user_choice == 'x':
            manager.save_to_file()
            print("Menu was saved successfully.")
            break
        else:
            print("Invalid choice. Please select v, a, d, or x.")

if __name__ == "__main__":
    manager = load_manager()
    show_user_menu(manager)