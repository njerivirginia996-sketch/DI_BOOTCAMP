#exercise 1
import random

def get_words_from_file(file_path):
    """
    Read words from a text file and return them as a list.

    Args:
        file_path (str): Path to the word list file.

    Returns:
        list: A list of words read from the file.
    """
    try:
        with open(file_path, "r") as file:
            content = file.read()
            words = content.split()
        return words
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return []
    except Exception as e:
        print(f"An unexpected error occurred while reading the file: {e}")
        return []

def get_random_sentence(length, file_path="words.txt"):
    """
    Generate a random sentence of the given length using words from a file.

    Args:
        length (int): The number of words in the sentence.
        file_path (str): Path to the word list file.

    Returns:
        str: A randomly generated sentence, or an empty string if the
             word list could not be loaded.
    """
    words = get_words_from_file(file_path)

    if not words:
        print("Error: No words available to generate a sentence.")
        return ""

    selected_words = [random.choice(words) for _ in range(length)]
    sentence = " ".join(selected_words)
    sentence = sentence.lower()

    return sentence

def main():
    print("=== Random Sentence Generator ===")
    print("This program generates a random sentence using words from a word list.")
    print("Please enter a sentence length between 2 and 20.\n")

    user_input = input("Enter the desired sentence length: ")

    try:
        length = int(user_input)
    except ValueError:
        print("Error: Please enter a valid integer.")
        return

    if length < 2 or length > 20:
        print("Error: The sentence length must be between 2 and 20 (inclusive).")
        return

    sentence = get_random_sentence(length)

    if sentence:
        print("\nGenerated sentence:")
        print(sentence)

if __name__ == "__main__":
    main()
    
    
#exercise 2
import json

sampleJson = """{ 
   "company":{ 
      "employee":{ 
         "name":"emma",
         "payable":{ 
            "salary":7000,
            "bonus":800
         }
      }
   }
}"""

# Step 1: Load the JSON string into a Python dictionary
data = json.loads(sampleJson)

# Step 2: Access and print the nested "salary" key
salary = data["company"]["employee"]["payable"]["salary"]
print(f"Salary: {salary}")

# Step 3: Add the "birth_date" key to the "employee" dictionary
data["company"]["employee"]["birth_date"] = "1995-05-15"import json

sampleJson = """{ 
   "company":{ 
      "employee":{ 
         "name":"emma",
         "payable":{ 
            "salary":7000,
            "bonus":800
         }
      }
   }
}"""

# Step 1: Load the JSON string into a Python dictionary
data = json.loads(sampleJson)

# Step 2: Access and print the nested "salary" key
salary = data["company"]["employee"]["payable"]["salary"]
print(f"Salary: {salary}")

# Step 3: Add the "birth_date" key to the "employee" dictionary
data["company"]["employee"]["birth_date"] = "1995-05-15"

# Step 4: Save the modified dictionary to a JSON file
with open("modified_sample.json", "w") as file:
    json.dump(data, file, indent=4)

print("Modified JSON saved successfully!")