#exercise 1
class Pets:
    def __init__(self, animals):
        self.animals = animals

    def walk(self):
        for animal in self.animals:
            print(animal.walk())

class Cat:
    is_lazy = True

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def walk(self):
        return f"{self.name} is just walking around"

class Bengal(Cat):
    def sing(self, sounds):
        return f"{sounds}"

class Chartreux(Cat):
    def sing(self, sounds):
        return f"{sounds}"

# Step 1: Create the Siamese Class
class Siamese(Cat):
    pass

# Step 2: Create a List of Cat Instances
bengal_obj = Bengal("Leo", 3)
chartreux_obj = Chartreux("Felix", 5)
siamese_obj = Siamese("Milo", 2)

all_cats = [bengal_obj, chartreux_obj, siamese_obj]

# Step 3: Create a Pets Instance
sara_pets = Pets(all_cats)

# Step 4: Take Cats for a Walk
sara_pets.walk()


#exercise 2
class Dog:
    def __init__(self, name, age, weight):
        self.name = name
        self.age = age
        self.weight = weight

    def bark(self):
        return f"{self.name} is barking"

    def run_speed(self):
        return (self.weight / self.age) * 10

    def fight(self, other_dog):
        my_power = self.run_speed() * self.weight
        other_power = other_dog.run_speed() * other_dog.weight

        if my_power > other_power:
            return f"{self.name} won the fight against {other_dog.name}"
        elif other_power > my_power:
            return f"{other_dog.name} won the fight against {self.name}"
        else:
            return f"It's a tie between {self.name} and {other_dog.name}!"

# Step 2: Create Dog Instances
dog1 = Dog("Rex", 4, 30)
dog2 = Dog("Max", 2, 25)
dog3 = Dog("Bella", 5, 20)

# Step 3: Test Dog Methods
print(dog1.bark())
print(f"{dog2.name}'s run speed: {dog2.run_speed()}")
print(dog1.fight(dog2))
print(dog3.fight(dog1))


#exercise 3
# Import the Dog class

import random


class PetDog(Dog):

    def __init__(self, name, age, weight):
        super().__init__(name, age, weight)
        self.trained = False

    def train(self):
        # Print the result of bark()
        # Then change trained to True
        pass

    def play(self, *args):
        # args contains dog instances
        # Get their names and print:
        # "<dog_names> all play together"
        pass

    def do_a_trick(self):
        # Only do a trick if the dog is trained
        # Use the tricks list given in the exercise
        # Choose a random trick
        pass


# Test your PetDog class
my_dog = PetDog("Fido", 2, 10)

# Test train()
my_dog.train()

# Test play()
my_dog.play(PetDog("Buddy", 3, 12), PetDog("Max", 4, 15))

# Test do_a_trick()
my_dog.do_a_trick()
#exercise 4
class Person:

    def __init__(self, first_name, age):
        self.first_name = first_name
        self.age = age
        self.last_name = ""

    def is_18(self):
        return self.age >= 18


class Family:

    def __init__(self, last_name):
        self.last_name = last_name
        self.members = []

    def born(self, first_name, age):
        new_person = Person(first_name, age)
        new_person.last_name = self.last_name
        self.members.append(new_person)

    def check_majority(self, first_name):
        for member in self.members:
            if member.first_name == first_name:
                if member.is_18():
                    print(
                        "You are over 18, your parents Jane and John accept that you will go out with your friends"
                    )
                else:
                    print(
                        "Sorry, you are not allowed to go out with your friends."
                    )
                return
        print(f"No family member named {first_name} was found.")

    def family_presentation(self):
        print(f"Family Name: {self.last_name}")
        for member in self.members:
            print(f"- {member.first_name}, Age: {member.age}")


# Testing the classes
my_family = Family("Smith")

# Adding members
my_family.born("Alice", 20)
my_family.born("Bob", 15)

# Checking majority
my_family.check_majority("Alice")
my_family.check_majority("Bob")

# Displaying family summary
my_family.family_presentation()
