#exercise 1
    # pattern 1
height = 3
for i in range(1, height + 1):
    spaces = " " * (height - i)
    stars = "*" * (2 * i - 1)
    print(spaces + stars)
    # pattern 2
    height = 5
for i in range(1, height + 1):
    spaces = " " * (height - i)
    stars = "*" * i
    print(spaces + stars)
    # pattern 3
    height = 5
for i in range(1, height + 1):
    spaces = " " * (height - i)
    stars = "*" * i
    print(spaces + stars)
for i in range(height, 0, -1):
    spaces = " " * (height - i)
    stars = "*" * i
    print(spaces + stars)
    
#exercise 2
my_list = [2, 24, 12, 354, 233]  # Initialize the list of integers to sort

for i in range(
    len(my_list) - 1
):  # Outer loop: iterates through indices 0 to 3 (len - 1)
    minimum = i  # Assume the current index 'i' holds the minimum value
    for j in range(
        i + 1, len(my_list)
    ):  # Inner loop: checks elements to the right of index 'i'
        if (
            my_list[j] < my_list[minimum]
        ):  # Check if element at 'j' is smaller than current minimum
            minimum = j  # Update 'minimum' index to 'j'
            if (
                minimum != i
            ):  # If new minimum index differs from 'i', swap them immediately
                my_list[i], my_list[minimum] = (
                    my_list[minimum],
                    my_list[i],
                )  # Swap values at index 'i' and index 'minimum'

print(my_list)  # Print the sorted list
    