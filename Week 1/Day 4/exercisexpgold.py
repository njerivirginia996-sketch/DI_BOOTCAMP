#exercise 1
CURRENT_YEAR = 2026
CURRENT_MONTH = 8
CURRENT_DAY = 21
def get_age(year, month, day):
    """Calculates age in years based on the current date."""
    age = CURRENT_YEAR - year
    if (CURRENT_MONTH, CURRENT_DAY) < (month, day):
        age -= 1
    return age
def can_retire(gender, date_of_birth):
    """Determines whether a person can retire based on gender and DOB."""
    year, month, day = map(int, date_of_birth.split("/"))
    age = get_age(year, month, day)
    if gender.lower() == "m":
        return age >= 67
    elif gender.lower() == "f":
        return age >= 62
    else:
        return False
user_gender = input("Enter your gender (m/f): ").strip()
user_dob = input("Enter your date of birth (YYYY/MM/DD): ").strip()

eligible = can_retire(user_gender, user_dob)

if eligible:
    print("You can retire!")
else:
    print("You cannot retire yet.")
    
#exercise 2
def calculate_sum(X):
    str_x = str(X)
    term1 = int(str_x)
    term2 = int(str_x * 2)
    term3 = int(str_x * 3)
    term4 = int(str_x * 4)
    return term1 + term2 + term3 + term4
result = calculate_sum(3)
print(f"Result for X=3: {result}")

#exercise 3
import random


def throw_dice():
    """Simulates rolling a single 6-sided die."""
    return random.randint(1, 6)


def throw_until_doubles():
    """Throws two dice repeatedly until both show the same number.

    Returns the number of pair throws required to reach doubles.
    """
    throws_count = 0
    while True:
        die1 = throw_dice()
        die2 = throw_dice()
        throws_count += 1
        if die1 == die2:
            break
    return throws_count


def main():
    # A list is ideal here for collecting sequential numerical measurements
    results = []

    # Roll doubles 100 times
    for _ in range(100):
        throws_taken = throw_until_doubles()
        results.append(throws_taken)

    # Calculate overall stats
    total_throws = sum(results)
    average_throws = round(total_throws / len(results), 2)

    # Output total and average results
    print(f"Total throws: {total_throws}")
    print(f"Average throws to reach doubles: {average_throws}")


# Run the main program
main()