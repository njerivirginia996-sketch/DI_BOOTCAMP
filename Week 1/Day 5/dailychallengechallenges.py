#challenge 1
# Step 1: Get Input
user_input = input("Enter comma-separated words: ")
# Step 2: Split the String into a list of words
words_list = user_input.split(",")
# Step 3: Sort the List in alphabetical order
sorted_list = sorted(words_list)
# Step 4: Join the Sorted List back into a single string
result_string = ",".join(sorted_list)
# Step 5: Print the Result
print(result_string)

#challenge 2
def longest_word(sentence):
    # Step 2: Split the sentence into words using spaces
    words = sentence.split()
    # Step 3: Initialize variables to keep track of the longest word found
    longest = ""
    # Step 4: Iterate through the words in the list
    for word in words:
        # Step 5: Compare word lengths
        # Using '>' ensures that if there are equal lengths, the first encountered word is kept
        if len(word) > len(longest):
            longest = word
    # Step 6: Return the longest word
    return longest
print(longest_word("Margaret's toy is a pretty doll."))  # Output: "Margaret's"
print(
    longest_word("A thing of beauty is a joy forever.")
)  
print(
    longest_word("Forgetfulness is by all means powerless!")
)  