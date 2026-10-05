import re
import string


class Text:
    def __init__(self, text):
        self.text = text

    def word_frequency(self, word):
        words = self.text.lower().split()
        count = words.count(word.lower())
        if count == 0:
            return None  # word not found
        return count

    def most_common_word(self):
        words = self.text.lower().split()
        if not words:
            return None

        frequencies = {}
        for w in words:
            frequencies[w] = frequencies.get(w, 0) + 1

        return max(frequencies, key=frequencies.get)

    def unique_words(self):
        words = self.text.lower().split()
        return list(set(words))

    @classmethod
    def from_file(cls, file_path):
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
        return cls(content)


class TextModification(Text):
    STOP_WORDS = {
        "a", "an", "the", "and", "or", "but", "if", "of", "at", "by", "for",
        "with", "to", "from", "in", "on", "is", "are", "was", "were", "be",
        "been", "it", "its", "this", "that", "these", "those", "as", "i",
        "you", "he", "she", "we", "they", "them", "his", "her", "our", "their",
    }

    def remove_punctuation(self):
        table = str.maketrans("", "", string.punctuation)
        return self.text.translate(table)

    def remove_stop_words(self):
        words = self.text.split()
        filtered = [w for w in words if w.lower() not in self.STOP_WORDS]
        return " ".join(filtered)

    def remove_special_characters(self):
        # Keep letters, digits and whitespace only
        return re.sub(r"[^A-Za-z0-9\s]", "", self.text)


# Testing
sample = "The cat sat on the mat. The cat was happy!"

t = Text(sample)
print(t.word_frequency("cat"))     # 2
print(t.word_frequency("dog"))     # None
print(t.most_common_word())        # the
print(t.unique_words())            # e.g. ['the', 'cat', 'sat', ...]

tm = TextModification(sample)
print(tm.remove_punctuation())          # The cat sat on the mat The cat was happy
print(tm.remove_stop_words())           # cat sat mat. cat happy!
print(tm.remove_special_characters())   # The cat sat on the mat The cat was happy

# From a file (create a "sample.txt" first)
# file_text = Text.from_file("sample.txt")
# print(file_text.most_common_word())