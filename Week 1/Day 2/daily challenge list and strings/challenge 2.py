def remove_consecutive_duplicates(word):
    result = ""
    for letter in word:
        if len(result) == 0 or result[-1] != letter:
            result += letter
    return result


word = input("Enter a word: ")
print(remove_consecutive_duplicates(word))