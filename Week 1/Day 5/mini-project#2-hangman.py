import random

wordslist = [
    "correction",
    "childish",
    "beach",
    "python",
    "assertive",
    "interference",
    "complete",
    "share",
    "credit card",
    "rush",
    "south",
]
word = random.choice(wordslist)

### YOUR CODE STARTS FROM HERE ###

# Visual stages for the gallows corresponding to 0 up to 6 incorrect guesses
HANGMAN_PICS = [
    """
   +---+
   |   |
       |
       |
       |
       |
=========""",
    """
   +---+
   |   |
   O   |
       |
       |
       |
=========""",
    """
   +---+
   |   |
   O   |
   |   |
       |
       |
=========""",
    """
   +---+
   |   |
   O   |
  /|   |
       |
       |
=========""",
    """
   +---+
   |   |
   O   |
  /|\\  |
       |
       |
=========""",
    """
   +---+
   |   |
   O   |
  /|\\  |
  /    |
       |
=========""",
    """
   +---+
   |   |
   O   |
  /|\\  |
  / \\  |
       |
=========""",
]

MAX_LIVES = 6
guessed_letters = set()
incorrect_guesses = 0


def display_word(secret_word, guessed):
    """Displays stars for unguessed letters, letters for correctly guessed ones, and preserves spaces."""
    display = []
    for char in secret_word:
        if char == " ":
            display.append(" ")
        elif char.lower() in guessed:
            display.append(char)
        else:
            display.append("*")
    return "".join(display)


print("Welcome to Hangman!")

while incorrect_guesses < MAX_LIVES:
    print(HANGMAN_PICS[incorrect_guesses])
    current_display = display_word(word, guessed_letters)
    print(f"\nWord to guess: {current_display}")

    # Check for win condition (no stars left)
    if "*" not in current_display:
        print("\n🎉 Congratulations! You guessed the word correctly!")
        break

    guess = input("Guess a letter: ").lower().strip()

    # Input validation
    if len(guess) != 1 or not guess.isalpha():
        print("⚠️ Please enter a single valid letter.")
        continue

    if guess in guessed_letters:
        print(
            f"⚠️ You've already guessed '{guess}'. Try guessing a different letter."
        )
        continue

    # Record the valid guess
    guessed_letters.add(guess)

    if guess in word.lower():
        print(f"Good job! '{guess}' is in the word.")
    else:
        incorrect_guesses += 1
        print(
            f"Sorry, '{guess}' is not in the word. Remaining lives: {MAX_LIVES - incorrect_guesses}"
        )

# Loss condition check
if incorrect_guesses == MAX_LIVES:
    print(HANGMAN_PICS[MAX_LIVES])
    print("\n💀 Game Over! You ran out of guesses.")
    print(f"The word was: '{word}'")