#exercise 1
def get_full_name(first_name, last_name, middle_name=""):
    """Returns a properly capitalized full name.
    Handles optional middle names.
    """
    if middle_name:
        full_name = f"{first_name} {middle_name} {last_name}"
    else:
        full_name = f"{first_name} {last_name}"

    return full_name.title()
print(get_full_name(first_name="john", middle_name="hooker", last_name="lee"))
print(get_full_name(first_name="bruce", last_name="lee"))

#exercise 2
# Translation mapping dictionary
MORSE_CODE_DICT = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----'
}
# Reverse mapping for decoding
REVERSE_MORSE_DICT = {value: key for key, value in MORSE_CODE_DICT.items()}
def english_to_morse(text):
    """Converts English text into Morse code."""
    text = text.upper()
    words = text.split(" ")
    morse_words = []
    for word in words:
        morse_letters = [MORSE_CODE_DICT[char] for char in word if char in MORSE_CODE_DICT]
        morse_words.append(" ".join(morse_letters))
    return " / ".join(morse_words)
def morse_to_english(morse):
    """Converts Morse code into English text."""
    morse_words = morse.strip().split(" / ")
    english_words = []
    for word in morse_words:
        morse_letters = word.split(" ")
        english_letters = [REVERSE_MORSE_DICT[code] for code in morse_letters if code in REVERSE_MORSE_DICT]
        english_words.append("".join(english_letters))
    return " ".join(english_words)
# --- Example Usage ---
english_text = "Hello World"
morse_result = english_to_morse(english_text)
print(f"English: {english_text}")
print(f"Morse: {morse_result}\n")
morse_text = ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
english_result = morse_to_english(morse_text)
print(f"Morse: {morse_text}")
print(f"English: {english_result}")

#exercise 3
def box_printer(*args):
    """Prints any number of strings inside a dynamic rectangular box of stars."""
    if not args:
        return
    # Find the length of the longest word
    max_len = max(len(word) for word in args)
    # Top border (* for each letter + 2 for outer stars + 2 for padding spaces)
    print("*" * (max_len + 4))
    # Print each word padded to match the longest word's length
    for word in args:
        print(f"* {word.ljust(max_len)} *")
    # Bottom border
    print("*" * (max_len + 4))
# Test Example
box_printer("Hello", "World", "in", "reallylongword", "a", "frame")

#exercise 4
#The purpose of this code is to sort a list of numbers in ascending order (smallest to largest) in-place using the Insertion Sort algorithm.
def insertion_sort(alist):
   for index in range(1,len(alist)):

     currentvalue = alist[index]
     position = index

     while position>0 and alist[position-1]>currentvalue:
         alist[position]=alist[position-1]
         position = position-1

     alist[position]=currentvalue

alist = [54,26,93,17,77,31,44,55,20]
insertion_sort(alist)
print(alist)