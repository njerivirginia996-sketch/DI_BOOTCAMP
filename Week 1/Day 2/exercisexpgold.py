#exercise 1
list1 = [2, 3, 4]
list2 = [5, 6, 7]
list1.extend(list2)
print(list1) 

#exercise 2
for num in range(1500, 2501):
    if num % 5 == 0 and num % 7 == 0:
        print(num)
        
#exercise 3
names = ['Samus', 'Cortana', 'V', 'Link', 'Mario', 'Cortana', 'Samus']
user_name = input("Enter your name: ")
if user_name in names:
    print(names.index(user_name))
else:
    print(f"'{user_name}' is not in the list.")
    
#exercise 4
num1 = float(input(50 ))
num2 = float(input(79 ))
num3 = float(input(12 ))
greatest = max(num1, num2, num3)
print(f"The greatest number is: {int(greatest) if greatest.is_integer() else greatest}")

 #exercise 5
import string
alphabet = string.ascii_lowercase
vowels = "aeiou"
for letter in alphabet:
    if letter in vowels:
        print(f"{letter} is a vowel.")
    else:
        print(f"{letter} is a consonant.")

#exercise 6
words = []
for i in range(7):
    word = input(f"Enter word {i + 1}: ")
    words.append(word)
    letter = input("Enter a single character: ")
for word in words:
    if letter in word:
        print(f"The first appearance of '{letter}' in '{word}' is at index {word.index(letter)}.")
    else:
        print(f"Sorry, the letter '{letter}' does not appear in the word '{word}'.")
        
#exercise 7
import time
numbers = list(range(1, 1000001))
print(f"Minimum value: {min(numbers)}")
print(f"Maximum value: {max(numbers)}")
calculate the sum and measure execution time
start_time = time.time()
total_sum = sum(numbers)
end_time = time.time()
execution_time = end_time - start_time
print(f"Sum of 1 to 1,000,000: {total_sum}")
print(f"Time taken to compute sum: {execution_time:.4f} seconds")

#exercise 8
user_input = input("Enter a string: ")
numbers_list = user_input.split(",")
numbers_tuple = tuple(numbers_list)
print(numbers_list)
print(numbers_tuple)

#exercise 9
import random
wins = 0
losses = 0
while True:
    user_input = input(
        "Guess a number between 1 and 9 (or type 'quit' to exit): "
    ).lower()
    if user_input == "quit":
        break
    if not user_input.isdigit() or not (1 <= int(user_input) <= 9):
        print("Invalid input. Please enter a number from 1 to 9.")
        continue
    user_guess = int(user_input)
    random_number = random.randint(1, 9)
    if user_guess == random_number:
        print("Winner")
        wins += 1
    else:
        print(f"better luck next time (the number was {random_number})")
        losses += 1
print(f"Total Wins: {wins}")
print(f"Total Losses: {losses}")
print("\n--- Game Over ---")
    

































