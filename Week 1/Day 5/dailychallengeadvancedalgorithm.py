import random

list_of_numbers = [random.randint(0, 10000) for _ in range(20000)]
target_number = 3728

# Using a set to find complements in O(1) average time
seen = set()
pairs = []

for num in list_of_numbers:
    complement = target_number - num
    if complement in seen:
        pairs.append((complement, num))
    seen.add(num)

# Print all found pairs
print(f"Found {len(pairs)} pairs that sum to {target_number}:\n")
for first, second in pairs:
    print(f"{first} and {second} sums to the target_number {target_number}")