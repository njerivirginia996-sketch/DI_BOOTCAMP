#exercise 1
class Currency:
    def __init__(self, currency, amount):
        self.currency = currency
        self.amount = amount

    # Your code starts HERE

    def __str__(self):
        return f'{self.amount} {self.currency}s'

    def __repr__(self):
        return f'{self.amount} {self.currency}s'

    def __int__(self):
        return self.amount

    def __add__(self, other):
        if isinstance(other, Currency):
            if self.currency != other.currency:
                raise TypeError(
                    f'Cannot add between Currency type <{self.currency}> and <{other.currency}>'
                )
            return self.amount + other.amount
        elif isinstance(other, int):
            return self.amount + other
        else:
            raise TypeError(f'Cannot add Currency and {type(other)}')

    def __iadd__(self, other):
        if isinstance(other, Currency):
            if self.currency != other.currency:
                raise TypeError(
                    f'Cannot add between Currency type <{self.currency}> and <{other.currency}>'
                )
            self.amount += other.amount
        elif isinstance(other, int):
            self.amount += other
        else:
            raise TypeError(f'Cannot add Currency and {type(other)}')
        return self
c1 = Currency('dollar', 5)
c2 = Currency('dollar', 10)
c3 = Currency('shekel', 1)
c4 = Currency('shekel', 10)

print(c1)          # '5 dollars'      -> __str__
print(int(c1))     # 5                -> __int__
print(repr(c1))    # '5 dollars'      -> __repr__

print(c1 + 5)       # 10  -> __add__ with an int, returns amount + 5
print(c1 + c2)      # 15  -> __add__ with a Currency, same label, returns amount + amount
print(c1)           # 5 dollars  -> c1 itself was never mutated by __add__

c1 += 5              # __iadd__ with int -> mutates c1.amount in place
print(c1)            # 10 dollars

c1 += c2             # __iadd__ with Currency, same label -> mutates c1.amount
print(c1)            # 20 dollars

print(c1 + c3)       # different currency labels -> raises TypeError



#exercise 3
import random
import string

# Step 2: Combine uppercase and lowercase letters
letters = string.ascii_letters  # Contains both 'a-z' and 'A-Z'

# Step 3: Select 5 random characters using a loop and concatenate them
random_string = ""
for _ in range(5):
    random_string += random.choice(letters)

print(random_string)


#exercise 4
import datetime

def display_current_date():
    # Step 2: Get the current date
    today = datetime.date.today()

    # Step 3: Display the date
    print(today)

display_current_date()
# e.g. 2026-08-26


#exercise 5
import datetime

def time_until_new_year():
    # Step 2: Get the current date and time
    now = datetime.datetime.now()

    # Step 3: Create a datetime object for January 1st of next year
    next_new_year = datetime.datetime(year=now.year + 1, month=1, day=1)

    # Step 4: Calculate the time difference
    time_left = next_new_year - now

    # Step 5: Display the time difference
    print(time_left)

time_until_new_year()
# e.g. 127 days, 9:27:43.123456


#exercise 6
from datetime import datetime


def minutes_lived(birthdate_str):
    # Step 1: Parse the string into a datetime object (Format: DD/MM/YYYY)
    birthdate = datetime.strptime(birthdate_str, "%d/%m/%Y")

    # Step 2: Get the current date and time
    now = datetime.now()

    # Step 3: Calculate the time difference (returns a timedelta object)
    time_lived = now - birthdate

    # Step 4: Convert total seconds into minutes (60 seconds = 1 minute)
    minutes = int(time_lived.total_seconds() // 60)

    # Step 5: Display the formatted message
    print(f"You have lived approximately {minutes:,} minutes in your life.")

# Example usage:
minutes_lived("15/05/1995")


#exercise 7
# Step 2: Import the faker module
from faker import Faker

fake = Faker()

# Step 3: Create an empty list of users
users = []

# Step 4: Create a function to add users
def add_users(number_of_users):
    for _ in range(number_of_users):
        user = {
            "name": fake.name(),
            "address": fake.address(),
            "language_code": fake.language_code()
        }
        users.append(user)

# Step 5: Call the function and print the users list
add_users(5)
print(users)



