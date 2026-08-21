#exercise 1
keys = ['ten', 'twenty', 'thirty']
values = [10, 20, 30]
result_dict = dict(zip(keys, values))
print(result_dict)

#exercise 2
family = {"rick": 43, "beth": 13, "morty": 5, "summer": 8}
total_cost = 0
print("--- Ticket Prices per Family Member ---")
for name, age in family.items():
    if age < 3:
        price = 0
    elif 3 <= age <= 12:
        price = 10
    else:
        price = 15
    total_cost += price
    print(f"{name.capitalize()}: ${price}")
print(f"\nTotal Cost: ${total_cost}")
print("\n--- Bonus: Custom Family Input ---")
user_family = {}
while True:
    name = input("Enter family member name (or 'done' to calculate): ").strip()
    if name.lower() == "done":
        break
    age = int(input(f"Enter age for {name}: "))
    user_family[name] = age
user_total_cost = 0
print("\n--- Custom Family Ticket Prices ---")
for name, age in user_family.items():
    if age < 3:
        price = 0
    elif 3 <= age <= 12:
        price = 10
    else:
        price = 15
    user_total_cost += price
    print(f"{name.capitalize()}: ${price}")
print(f"\nTotal Cost for User Family: ${user_total_cost}")

#exercise 3
brand = {
    "name": "Zara",
    "creation_date": 1975,
    "creator_name": "Amancio Ortega Gaona",
    "type_of_clothes": ["men", "women", "children", "home"],
    "international_competitors": ["Gap", "H&M", "Benetton"],
    "number_stores": 7000,
    "major_color": {"France": "blue", "Spain": "red", "US": ["pink", "green"]},
}
brand["number_stores"] = 2
clients = ", ".join(brand["type_of_clothes"])
print(f"Zara produces clothing and goods for: {clients}.")
brand["country_creation"] = "Spain"
if "international_competitors" in brand:
    brand["international_competitors"].append("Desigual")
del brand["creation_date"]
print("Last competitor:", brand["international_competitors"][-1])
print("US major colors:", brand["major_color"]["US"])
print("Total number of keys:", len(brand))
print("Dictionary keys:", list(brand.keys()))
more_on_zara = {"creation_date": 1975, "number_stores": 10000}
brand.update(more_on_zara)
print("\n--- Merged Brand Dictionary ---")
print(brand)

#exercise 4
users = ["Mickey", "Minnie", "Donald", "Ariel", "Pluto"]
# 1. Character to Index
disney_dict_1 = {character: index for index, character in enumerate(users)}
print(disney_dict_1)
# 2. Index to Character
disney_dict_2 = {index: character for index, character in enumerate(users)}
print(disney_dict_2)
# 3. Alphabetically Sorted Character to Index
disney_dict_3 = {
    character: index for index, character in enumerate(sorted(users))
}
print(disney_dict_3)











