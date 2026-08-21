#exercise 1
#favorite numbers
my_fav_numbers = {7, 9, 21, 28, 35}
# Add two new numbers 
my_fav_numbers.add(42)
last_added = 49
my_fav_numbers.add(last_added)
#remove the last number added
my_fav_numbers.remove(last_added) 
# Create another set with friend's favorite numbers
friend_fav_numbers = {3, 6, 9, 12, 15}
#concatenate (union) the two sets to create our_fav_numbers
our_fav_numbers = my_fav_numbers.union(friend_fav_numbers)
#print results to verify
print("My Favorite Numbers:", my_fav_numbers)
print("Friend's Favorite Numbers:", friend_fav_numbers)
print("Our Favorite Numbers:", our_fav_numbers)

#exercise 2
my_tuple = (1, 2, 3)
try:
    my_tuple.append(4)  # This will raise an AttributeError
except AttributeError as e:
    print(f"Error: {e}")
new_tuple = my_tuple + (4, 5)
print("Original Tuple:", my_tuple)
print("New Tuple:", new_tuple)

#exercise 3
basket = ["Banana", "Apples", "Oranges", "Blueberries"]
#remove the Banana from the basket
basket.remove("Banana")
#remove the Blueberries from the basket
basket.remove("Blueberries")
#add Kiwi to the end of the basket
basket.append("Kiwi")
#add Apples to the beginning of the basket
basket.insert(0, "Apples")

#exercise 4
current = 1.5
sequence = []
while current <= 5:
    # If the number has no fractional part (e.g., 2.0), convert it to int
    if current.is_integer():
        sequence.append(int(current))
    else:
        sequence.append(current)
    current += 0.5
print("Generated Sequence:", sequence)

#exercise 5
for i in range(1, 21):
   if i % 2 == 0:
       print(i)

#exercise 6
while True:
    name = input("Enter your name: ")
    if any(char.isdigit() for char in name) or len(name) < 3:
        print("give the correct name: ", end="")
    else:
        print("thank you")
        break
    
#exercise 7
fav_fruits_input = input("Enter your favorite fruits (separated by single spaces): ")
fav_fruits_list = fav_fruits_input.split()
chosen_fruit = input("Enter the name of any fruit: ")
if chosen_fruit.strip().lower() in [fruit.lower() for fruit in fav_fruits_list]:
    print("You chose one of your favorite fruits! Enjoy!")
else:
    print("You chose a new fruit. I hope you enjoy it!")

#exercise 8
toppings = []
base_price = 10.0
topping_price = 2.50
while True:
    topping = input("Enter a pizza topping (or 'quit' to finish): ").strip()
    if topping.lower() == "quit":
        break
    toppings.append(topping)
    print(f"Adding {topping} to your pizza.")
    total_cost = base_price + (len(toppings) * topping_price)
    print("\n--- Your Order Summary ---")
    print("Toppings selected:", ", ".join(toppings) if toppings else "None")
    print(f"Total cost: ${total_cost:.2f}")
    
    #exercise 9
    total_cost = 0
    num_people = int(input("How many people are buying tickets? "))
    for i in range(1, num_people + 1):
        age = int(input(f"Enter the age of person {i}: "))
        if age < 3:
            price = 0
        elif 3 <= age <= 12:
            price = 10
        else:  # age > 12
            price = 15
        total_cost += price
print(f"\nThe total ticket cost for the group is: ${total_cost}")   
    
    
    
    
    
    
    
    
    
    
    
    































