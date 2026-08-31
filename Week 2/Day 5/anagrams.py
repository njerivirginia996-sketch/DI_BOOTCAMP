from anagram_checker import AnagramChecker

def get_clean_input():
    """Prompt the user for input and validate it contains only a single alphabetic word."""
    while True:
        raw_input = input("Enter a word: ").strip()

        # Check for multiple words
        if len(raw_input.split()) > 1:
            print("Error: Please enter only a single word (no spaces or multiple words).\n")
            continue

        # Check for non-alphabetic characters
        if not raw_input.isalpha():
            print("Error: Only alphabetic characters (letters A-Z) are allowed.\n")
            continue

        return raw_input

def display_word_details(checker, word):
    """Check validity, fetch anagrams, and print the formatted summary."""
    clean_word = word.lower()
    is_valid = checker.is_valid_word(clean_word)
    anagrams = checker.get_anagrams(clean_word)

    print("\n" + "=" * 35)
    print(f"YOUR WORD : \"{clean_word.upper()}\"")
    print(f"THIS IS A VALID ENGLISH WORD: {is_valid}")
    
    if anagrams:
        print(f"ANAGRAMS FOUND: {', '.join(anagrams)}")
    else:
        print("ANAGRAMS FOUND: None")
    print("=" * 35 + "\n")

def main():
    try:
        # Instantiate AnagramChecker (Ensure your text file matches this filename)
        checker = AnagramChecker("sowpods.txt")
    except FileNotFoundError:
        print("Error: The word list file was not found. Please place your text file in the working directory.")
        return

    while True:
        print("--- ANAGRAM CHECKER MENU ---")
        print("1. Input a word")
        print("2. Exit")

        choice = input("Choose an option (1 or 2): ").strip()

        if choice == "1":
            user_word = get_clean_input()
            display_word_details(checker, user_word)
        elif choice == "2":
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please enter 1 or 2.\n")

if __name__ == "__main__":
    main()