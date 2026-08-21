#exercise 1
# 1. Base String
cars_str = "Volkswagen, Toyota, Ford Motor, Honda, Chevrolet"
# 2. Convert to list
manufacturers = [name.strip() for name in cars_str.split(",")]
# 3. Print count
print(f"Total manufacturers in the list: {len(manufacturers)}")
# 4. Print list in descending order (Z-A)
sorted_desc = sorted(manufacturers, reverse=True)
print("Descending order (Z-A):", sorted_desc)
# 5a. Count names with 'o' (case-insensitive)
count_o = sum(1 for name in manufacturers if "o" in name.lower())
print(f"Manufacturers with 'o': {count_o}")
# 5b. Count names without 'i' (case-insensitive)
count_no_i = sum(1 for name in manufacturers if "i" not in name.lower())
print(f"Manufacturers without 'i': {count_no_i}")
# Bonus 1: Remove Duplicates
duplicates_list = [
    "Honda",
    "Volkswagen",
    "Toyota",
    "Ford Motor",
    "Honda",
    "Chevrolet",
    "Toyota",
]
# Preserve insertion order while removing duplicates, or sort alphabetically
unique_companies = sorted(list(set(duplicates_list)))
formatted_companies = ", ".join(unique_companies)
print("\n--- Bonus 1 ---")
print("Unique companies:", formatted_companies)
print(f"Total unique companies: {len(unique_companies)}")
# Bonus 2: Sorted A-Z with Reversed Names
sorted_asc = sorted(manufacturers)
reversed_names = [name[::-1] for name in sorted_asc]
print("\n--- Bonus 2 ---")
print("Ascending (A-Z) with reversed characters:", reversed_names)