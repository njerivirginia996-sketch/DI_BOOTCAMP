#exercise 1
def display_message():
    print("I am learning about functions in Python.")
display_message()

#exercise 2
def favorite_book(title):
    print(f"One of my favourite books is {title}.")
    favorite_book("The Water Lilly")
    
#exercise 3
def describe_city(city, country="unknown"):
    print(f"{city} is in {country}.")
describe_city("Reykjavik", "Iceland")
describe_city("Paris")
describe_city("Tokyo", "Japan")

#exercise 4
import random
def compare_numbers(user_number):
    random_number = random.randint(1, 100)
    if user_number == random_number:
        print("Success!")
    else:
        print(
            f"Fail! Your number: {user_number}, Random number: {random_number}"
        )
compare_numbers(50)

#exercise 5
def make_shirt(size="large", text="I love Python"):
    print(f"The size of the shirt is {size} and the text is {text}.")
make_shirt()
make_shirt("medium")
make_shirt("small", "Keep Calm and Code On")
make_shirt(size="small", text="Hello!")
make_shirt(text="Developer Mode", size="extra-large")

#exercise 6
magician_names = ["Harry Houdini", "David Blaine", "Criss Angel"]
def show_magicians(magicians):
    for magician in magicians:
        print(magician)
def make_great(magicians):
    for i in range(len(magicians)):
        magicians[i] = f"{magicians[i]} the Great"
make_great(magician_names)
show_magicians(magician_names)

#exercise 7
import random

# Step 1 & 4 & 5: Function to generate seasonal temperature (Bonus features included)
def get_random_temp(season):
    """Generates a random float temperature based on the season."""
    if season == "winter":
        return round(random.uniform(-10.0, 5.0), 1)
    elif season == "spring":
        return round(random.uniform(6.0, 18.0), 1)
    elif season == "summer":
        return round(random.uniform(24.0, 40.0), 1)
    else:  # autumn/fall
        return round(random.uniform(10.0, 23.0), 1)


def get_season_from_month(month):
    """Maps month number (1-12) to a season."""
    if month in [12, 1, 2]:
        return "winter"
    elif month in [3, 4, 5]:
        return "spring"
    elif month in [6, 7, 8]:
        return "summer"
    else:
        return "autumn"


# Step 2 & 3: Main Function
def main():
    # Step 5 Bonus: Ask user for month
    try:
        month = int(input("Enter the month number (1-12): "))
        if month < 1 or month > 12:
            print("Invalid month. Defaulting to current season.")
            season = "summer"
        else:
            season = get_season_from_month(month)
    except ValueError:
        print("Invalid input. Defaulting to summer.")
        season = "summer"

    # Step 1 & 4: Get floating-point random temperature
    temp = get_random_temp(season)
    
    # Step 2: Print current temperature
    print(f"\nThe temperature right now is {temp} degrees Celsius.")

    # Step 3: Temperature-based advice
    if temp < 0:
        print("Brrr, that’s freezing! Wear some extra layers today.")
    elif 0 <= temp <= 16:
        print("Quite chilly! Don’t forget your coat.")
    elif 16 < temp <= 23:
        print("Nice weather.")
    elif 23 < temp <= 32:
        print("A bit warm, stay hydrated.")
    else:
        print("It's really hot! Stay cool.")


# Run the program
main()