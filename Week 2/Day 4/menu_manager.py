import json

class MenuManager:
    def __init__(self, file_path="restaurant_menu.json"):
        self.file_path = file_path
        with open(self.file_path, "r") as file:
            self.menu = json.load(file)

    def add_item(self, name, price):
        self.menu["items"].append({"name": name, "price": float(price)})

    def remove_item(self, name):
        for index, item in enumerate(self.menu["items"]):
            if item["name"].lower() == name.lower():
                del self.menu["items"][index]
                return True
        return False

    def save_to_file(self):
        with open(self.file_path, "w") as file:
            json.dump(self.menu, file, indent=4)