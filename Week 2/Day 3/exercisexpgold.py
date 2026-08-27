#exercise 1
from datetime import date
import holidays


def display_today_and_next_holiday(country='US'):
    # 1. Display today's date
    today = date.today()
    print(f"Today's date is: {today.strftime('%B %d, %Y')}")
    
    # 2. Find the next upcoming holiday
    country_holidays = holidays.country_holidays(country)
    
    # Look ahead year by year until we find a holiday after today
    year = today.year
    upcoming = {d: name for d, name in country_holidays.items() if d >= today}
    
    # If none found in current year's list, check next year too
    if not upcoming:
        next_year_holidays = holidays.country_holidays(country, years=year + 1)
        upcoming = {d: name for d, name in next_year_holidays.items() if d >= today}
    
    next_date = min(upcoming.keys())
    next_name = upcoming[next_date]
    days_left = (next_date - today).days
    
    print(f"The next holiday is {next_name}, in {days_left} days ({next_date.strftime('%B %d, %Y')}).")

# Run it
display_today_and_next_holiday('US')


#exercise 2
def age_on_planets(age_in_seconds):
    EARTH_YEAR_SECONDS = 31557600  # seconds in one Earth year

    # Orbital periods in Earth years
    orbital_periods = {
        'Mercury': 0.2408467,
        'Venus': 0.61519726,
        'Earth': 1.0,
        'Mars': 1.8808158,
        'Jupiter': 11.862615,
        'Saturn': 29.447498,
        'Uranus': 84.016846,
        'Neptune': 164.79132
    }

    earth_years = age_in_seconds / EARTH_YEAR_SECONDS

    print(f"Given {age_in_seconds:,} seconds, you would be:")
    for planet, period in orbital_periods.items():
        planet_years = earth_years / period
        print(f"  {planet}-years old: {planet_years:.2f}")

# Example usage
age_on_planets(1_000_000_000)


#exercise 3
import re

def return_numbers(text):
    # Find all digit characters in the string
    digits = re.findall(r'\d', text)
    
    # Join them into a single string, then convert to int
    result = int(''.join(digits))
    
    return result


# Example usage
print(return_numbers('k5k3q2g5z6x9bn'))  # Expected output: 532569


#exercise 4
import re

def check_name(name):
    """
    Validates a full name:
    - only letters and one space allowed
    - first letter of each name part must be uppercase
    """
    pattern = r'^[A-Z][a-z]*(?: [A-Z][a-z]*)$'
    return re.match(pattern, name) is not None

full_name = input("What's your name? ")

if check_name(full_name):
    print("Hello, {}!".format(full_name))
else:
    print("This name is invalid")
    
    
#exercise 5
"""
Exercise 5: Python Password Generator
--------------------------------------
Generates a random password of a user-specified length (6-30) that
contains at least one digit, one lowercase letter, one uppercase
letter, and one special character.
"""

import random
import string


# ---------------------------------------------------------------------
# Character pools
# ---------------------------------------------------------------------
DIGITS = string.digits                # 0-9
LOWERCASE = string.ascii_lowercase    # a-z
UPPERCASE = string.ascii_uppercase    # A-Z
SPECIAL = "!@#$%^&*()-_=+[]{};:,.<>?/"


# ---------------------------------------------------------------------
# Core functions
# ---------------------------------------------------------------------
def generate_password(length: int) -> str:
    """
    Generate a random password of the given length that is guaranteed
    to contain at least one digit, one lowercase letter, one uppercase
    letter, and one special character.
    """
    if length < 4:
        raise ValueError("Length must be at least 4 to include all character types.")

    # Step 1: guarantee at least one of each required character type.
    password_chars = [
        random.choice(DIGITS),
        random.choice(LOWERCASE),
        random.choice(UPPERCASE),
        random.choice(SPECIAL),
    ]

    # Step 2: fill the rest of the password from the combined pool.
    all_chars = DIGITS + LOWERCASE + UPPERCASE + SPECIAL
    remaining_length = length - len(password_chars)
    password_chars += [random.choice(all_chars) for _ in range(remaining_length)]

    # Step 3: shuffle so the guaranteed characters aren't always at the front.
    random.shuffle(password_chars)

    return "".join(password_chars)


def is_valid_password(password: str, expected_length: int) -> bool:
    """
    Check that a password:
      - has the expected length
      - contains at least one digit
      - contains at least one lowercase letter
      - contains at least one uppercase letter
      - contains at least one special character
    """
    if len(password) != expected_length:
        return False

    has_digit = any(char in DIGITS for char in password)
    has_lower = any(char in LOWERCASE for char in password)
    has_upper = any(char in UPPERCASE for char in password)
    has_special = any(char in SPECIAL for char in password)

    return has_digit and has_lower and has_upper and has_special


def get_valid_length() -> int:
    """
    Repeatedly prompt the user until they enter a valid integer
    between 6 and 30 (inclusive).
    """
    while True:
        user_input = input("Enter the desired password length (6-30): ")
        try:
            length = int(user_input)
        except ValueError:
            print("That's not a valid number. Please try again.")
            continue

        if 6 <= length <= 30:
            return length
        else:
            print("Please enter a number between 6 and 30.")


# ---------------------------------------------------------------------
# Test function
# ---------------------------------------------------------------------
def test_generate_password(num_tests: int = 100) -> None:
    """
    Generate `num_tests` passwords, each with a different random length
    (between 6 and 30), and verify that each one:
      - meets all the character-type requirements
      - has the correct length
    """
    print(f"Running {num_tests} tests on generate_password()...")

    for i in range(1, num_tests + 1):
        length = random.randint(6, 30)
        password = generate_password(length)

        assert is_valid_password(password, length), (
            f"Test {i} FAILED: password '{password}' (length {length}) "
            "does not meet requirements."
        )

    print(f"All {num_tests} tests passed! ✅")


# ---------------------------------------------------------------------
# Main program
# ---------------------------------------------------------------------
def main():
    # Run the automated tests first, so we know generate_password() is solid.
    test_generate_password(100)
    print()

    # Now run the actual interactive program.
    length = get_valid_length()
    password = generate_password(length)

    print(f"\nYour new password is: {password}")
    print("Please store it somewhere safe, like a password manager! 🔒")


if __name__ == "__main__":
    main()

