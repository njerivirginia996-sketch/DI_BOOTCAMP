# Ask the user for inputs
number = int(input("Enter a number: "))
length = int(input("Enter a length: "))

# Generate the list of multiples using a loop
multiples = []
for i in range(1, length + 1):
    multiples.append(number * i)

# Output the result
print(multiples)