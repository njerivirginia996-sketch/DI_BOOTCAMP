class AnagramChecker:
    def __init__(self, filename="sowpods.txt"):
        """Load the word list file into a set stored in lowercase."""
        with open(filename, "r", encoding="utf-8") as file:
            # Using a set for O(1) lookup speed and storing words in lowercase
            self.word_list = {line.strip().lower() for line in file if line.strip()}

    def is_valid_word(self, word):
        """Check if the given word exists in the loaded word list (case-insensitive)."""
        return word.strip().lower() in self.word_list

    def is_anagram(self, word1, word2):
        """Check if two words are anagrams of each other."""
        w1 = word1.strip().lower()
        w2 = word2.strip().lower()
        return sorted(w1) == sorted(w2)

    def get_anagrams(self, word):
        """Iterate through the word list and return all valid anagrams excluding the word itself."""
        target_word = word.strip().lower()
        anagrams = []

        for candidate in self.word_list:
            if candidate != target_word and self.is_anagram(target_word, candidate):
                anagrams.append(candidate)

        return anagrams