#exercise 1
class Cat:
    def __init__(self, cat_name, cat_age):
        self.name = cat_name
        self.age = cat_age


# Step 1: Create cat objects
cat1 = Cat("Whiskers", 3)
cat2 = Cat("Felix", 7)
cat3 = Cat("Mittens", 5)


# Step 2: Create a function to find the oldest cat
def find_oldest_cat(cat1, cat2, cat3):
    oldest_cat = cat1

    if cat2.age > oldest_cat.age:
        oldest_cat = cat2
    if cat3.age > oldest_cat.age:
        oldest_cat = cat3

    return oldest_cat


# Step 3: Print the oldest cat's details
oldest = find_oldest_cat(cat1, cat2, cat3)
print(f"The oldest cat is {oldest.name}, and is {oldest.age} years old.")

#exercise 2
# Step 1: Create the Dog Class
class Dog:
    def __init__(self, name, height):
        self.name = name
        self.height = height

    def bark(self):
        print(f"{self.name} goes woof!")

    def jump(self):
        x = self.height * 2
        print(f"{self.name} jumps {x} cm high!")


# Step 2: Create Dog Objects
davids_dog = Dog("Rex", 50)
sarahs_dog = Dog("Teacup", 20)

# Step 3: Print Dog Details and Call Methods
print(f"David's dog name is {davids_dog.name} and height is {davids_dog.height} cm.")
davids_dog.bark()
davids_dog.jump()

print(f"Sarah's dog name is {sarahs_dog.name} and height is {sarahs_dog.height} cm.")
sarahs_dog.bark()
sarahs_dog.jump()

# Step 4: Compare Dog Sizes
if davids_dog.height > sarahs_dog.height:
    print(f"{davids_dog.name} is bigger than {sarahs_dog.name}.")
elif sarahs_dog.height > davids_dog.height:
    print(f"{sarahs_dog.name} is bigger than {davids_dog.name}.")
else:
    print("Both dogs are the same size!")
    
#exercise 3
class Song:
    def __init__(self, lyrics):
        self.lyrics = lyrics

    def sing_me_a_song(self):
        for line in self.lyrics:
            print(line)

# Example usage:
stairway = Song(
    [
        "There’s a lady who's sure",
        "all that glitters is gold",
        "and she’s buying a stairway to heaven",
    ]
)

stairway.sing_me_a_song()

#exercise 4
class Zoo:

    def __init__(self, zoo_name):
        self.name = zoo_name
        self.animals = []

    # Bonus: Accepts one or multiple animals using *args
    def add_animal(self, *new_animals):
        for animal in new_animals:
            if animal not in self.animals:
                self.animals.append(animal)

    def get_animals(self):
        print(f"Animals in {self.name}: {', '.join(self.animals)}")

    def sell_animal(self, animal_sold):
        if animal_sold in self.animals:
            self.animals.remove(animal_sold)
            print(f"{animal_sold} was sold.")
        else:
            print(f"{animal_sold} is not in the zoo.")

    def sort_animals(self):
        # Sort animals alphabetically
        self.animals.sort()

        # Group animals by their first letter
        grouped_animals = {}
        for animal in self.animals:
            first_letter = animal[0].upper()
            if first_letter not in grouped_animals:
                grouped_animals[first_letter] = []
            grouped_animals[first_letter].append(animal)

        return grouped_animals

    def get_groups(self):
        groups = self.sort_animals()
        print("\nAnimal Groups:")
        for letter, animal_list in groups.items():
            print(f"{letter}: {animal_list}")


# Step 2: Create a Zoo instance
brooklyn_safari = Zoo("Brooklyn Safari")

# Step 3: Test the Zoo methods
# Using *args bonus to add multiple animals at once or individually
brooklyn_safari.add_animal(
    "Giraffe", "Bear", "Baboon", "Cat", "Cougar", "Lion", "Zebra"
)
brooklyn_safari.get_animals()

brooklyn_safari.sell_animal("Bear")
brooklyn_safari.get_animals()

brooklyn_safari.get_groups() 







          
        
        





















       


