#exercise 1
import math
C = 50
H = 30
user_input = input("Enter comma-separated values for D: ")
d_list = user_input.split(",")
results = []
for d in d_list:
    D = float(d.strip())
    Q = round(math.sqrt((2 * C * D) / H))
    results.append(str(Q))
print(",".join(results))

#exercise 2
import random
# 1. Store the list of numbers in a variable
numbers = [3, 47, 99, -80, 22, 97, 54, -23, 5, 7]
# 2. Basic Prints & Information-
# 2a. Printed in a single line
print("Original List:", numbers)
# 2b. Sorted in descending order
sorted_desc = sorted(numbers, reverse=True)
print("Sorted (Descending):", sorted_desc)
# 2c. Sum of all numbers
print("Sum (built-in):", sum(numbers))
# 3. First and last numbers
first_and_last = [numbers[0], numbers[-1]]
print("First and Last:", first_and_last)
# 4. Numbers greater than 50
greater_than_50 = [num for num in numbers if num > 50]
print("Numbers > 50:", greater_than_50)
# 5. Numbers smaller than 10
smaller_than_10 = [num for num in numbers if num < 10]
print("Numbers < 10:", smaller_than_10)
# 6. Squared numbers
squared_numbers = [num**2 for num in numbers]
print("Squared Numbers:", squared_numbers)
# 7. Without duplicates and count
unique_numbers = list(set(numbers))
print("Without Duplicates:", unique_numbers)
print("Count of Unique Numbers:", len(unique_numbers))
# 8. Average
avg = sum(numbers) / len(numbers)
print("Average (built-in):", avg)
# 9 & 10. Largest and smallest numbers
print("Largest (built-in):", max(numbers))
print("Smallest (built-in):", min(numbers))
# 11. Bonus: Without built-in functions
manual_sum = 0
manual_largest = numbers[0]
manual_smallest = numbers[0]
count = 0
for num in numbers:
    manual_sum += num
    count += 1
    if num > manual_largest:
        manual_largest = num
    if num < manual_smallest:
        manual_smallest = num
manual_avg = manual_sum / count
print("\n--- Manual Calculations (Bonus 11) ---")
print("Manual Sum:", manual_sum)
print("Manual Average:", manual_avg)
print("Manual Largest:", manual_largest)
print("Manual Smallest:", manual_smallest)
# 12. Bonus: Get 10 numbers from user input
# 13. Bonus: Generate 10 random numbers (-100 to 100)
random_10 = [random.randint(-100, 100) for _ in range(10)]
print("\nGenerated 10 Random Numbers:", random_10)-
# 14. Bonus: Random count of integers (>= 50)
random_count = random.randint(50, 100)
random_dynamic_list = [
    random.randint(-100, 100) for _ in range(random_count)
]
print(
    f"\nGenerated {len(random_dynamic_list)} random numbers (showing first 10):",
    random_dynamic_list[:10],
)

#exercise 3
import re
paragraph = (
    "Python is an interpreted, high-level, general-purpose programming language. "
    "Created by Guido van Rossum and first released in 1991, Python's design philosophy "
    "emphasizes code readability with its notable use of significant whitespace. "
    "Its language constructs and object-oriented approach aim to help programmers write clear, "
    "logical code for small and large-scale projects."
)
char_count = len(paragraph)
sentences = [s for s in re.split(r"[.!?]+", paragraph) if s.strip()]
sentence_count = len(sentences)
words = re.findall(r"\b\w+\b", paragraph.lower())
word_count = len(words)
unique_words = set(words)
unique_word_count = len(unique_words)
non_whitespace_count = len("".join(paragraph.split()))
avg_words_per_sentence = (
    word_count / sentence_count if sentence_count > 0 else 0
)
non_unique_word_count = word_count - unique_word_count
print("=" * 45)
print("          PARAGRAPH ANALYSIS REPORT          ")
print("=" * 45)
print(f"Total Characters:               {char_count}")
print(f"Total Sentences:                {sentence_count}")
print(f"Total Words:                    {word_count}")
print(f"Unique Words:                   {unique_word_count}")
print("-" * 45)
print("BONUS ANALYSIS:")
print(f"Non-Whitespace Characters:      {non_whitespace_count}")
print(f"Avg Words per Sentence:         {avg_words_per_sentence:.2f}")
print(f"Non-Unique (Repeated) Words:    {non_unique_word_count}")
print("=" * 45)

#exercise 4
text_input = input("Enter a sentence: ")
words = text_input.split()
word_counts = {}
for word in words:
    word_counts[word] = word_counts.get(word, 0) + 1
sorted_words = sorted(word_counts.keys())
for word in sorted_words:
    print(f"{word}:{word_counts[word]}")
