# Exercise 1
print("Hello world\n" * 4, end="")

# Exercise 2
result = (99**3) * 8
print(result)

# Exercise 3
print(5 < 3) # False
print(3 == 3) # True
print(3 == "3") # False
print("3" > 3) # False
print("Hello" == "hello") # False

# Exercise 4
computer_brand = "Apple"
print(f"I have an {computer_brand} computer")

# Exercise 5
name = "Virgie"
age = 20
shoe_size = 6
info = f"My name is {name}, I am {age} years old, my shoe size is {shoe_size}, and I love reading books."
print(info)

# Exercise 6
a = 7
b = 2
if a > b:
print("Hello World") 

# Exercise 7
number = int(input("Enter a number: "))
if number % 2 == 0:
    print(f"{number} is even.")
else:
    print(f"{number} is odd.")

# Exercise 8
my_name = "Virgie"
user_name = input("What is your name? ")
if user_name.strip().lower() == my_name.lower():
    print(f"No way! You're named {my_name} too? That's awesome! 😄")
else:
    print(f"Ah, {user_name}... a respectable name, but it's no {my_name}.  😎") 
    
# Exercise 9
height = int(input("Please enter your height in centimeters: "))
if height > 100:
    print("You are tall enough to ride!")
else:
    print("Sorry, you need to grow some more to ride.")
    
