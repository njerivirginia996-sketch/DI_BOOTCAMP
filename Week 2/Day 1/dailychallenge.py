class Farm:

    def __init__(self, farm_name):
        self.name = farm_name
        self.animals = {}

    # Step 3 & Step 8 (Bonus): Upgraded to handle positional args or keyword args (**kwargs)
    def add_animal(self, animal_type=None, count=1, **kwargs):
        # Handle standard positional/keyword call: add_animal('cow', 5)
        if animal_type:
            self.animals[animal_type] = (
                self.animals.get(animal_type, 0) + count
            )

        # Handle **kwargs call: add_animal(cow=5, sheep=2, goat=12)
        for animal, qty in kwargs.items():
            self.animals[animal] = self.animals.get(animal, 0) + qty

    # Step 4: Display farm name, formatted animals list, and phrase
    def get_info(self):
        output = f"{self.name}'s farm\n\n"
        for animal, count in self.animals.items():
            output += f"{animal:<7} : {count}\n"
        output += "\n    E-I-E-I-0!"
        return output

    # Step 6 (Bonus): Return a sorted list of animal types
    def get_animal_types(self):
        return sorted(list(self.animals.keys()))

    # Step 7 (Bonus): Return a short summary of farm animals with pluralization
    def get_short_info(self):
        animal_types = self.get_animal_types()
        formatted_animals = []

        for animal in animal_types:
            # Add 's' if the quantity is greater than 1
            if self.animals[animal] > 1:
                formatted_animals.append(f"{animal}s")
            else:
                formatted_animals.append(animal)

        # Format grammatical list (e.g., "cows, goats and sheeps")
        if len(formatted_animals) > 1:
            animals_str = (
                ", ".join(formatted_animals[:-1])
                + " and "
                + formatted_animals[-1]
            )
        else:
            animals_str = formatted_animals[0]

        return f"{self.name}'s farm has {animals_str}."


# ==================== Step 5: Testing Code ====================

macdonald = Farm("McDonald")

# Standard additions
macdonald.add_animal("cow", 5)
macdonald.add_animal("sheep")
macdonald.add_animal("sheep")
macdonald.add_animal("goat", 12)

# Step 8 Bonus addition test: passing multiple animals via **kwargs
# macdonald.add_animal(cow=5, sheep=2, goat=12)

# Print full info
print(macdonald.get_info())

print("\n" + "=" * 30 + "\n")

# Testing Bonus Methods
print("Sorted Animal Types:", macdonald.get_animal_types())
print(macdonald.get_short_info())