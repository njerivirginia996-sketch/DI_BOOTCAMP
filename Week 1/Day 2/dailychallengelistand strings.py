# Challenge 1: Multiples of a Number
def get_multiples():
    number = int(input("Enter a number: "))
    length = int(input("Enter a length: "))

    multiples = []
    for i in range(1, length + 1):
        multiples.append(number * i)

    print(multiples)


# Challenge 2: Remove Consecutive Duplicate Letters
def remove_consecutive_duplicates():
    word = input("Enter a word: ")

    result = ""
    for letter in word:
        if len(result) == 0 or result[-1] != letter:
            result += letter

    print(result)


# Run both challenges
print("=== Challenge 1: Multiples of a Number ===")
get_multiples()

print("\n=== Challenge 2: Remove Consecutive Duplicate Letters ===")
remove_consecutive_duplicates()