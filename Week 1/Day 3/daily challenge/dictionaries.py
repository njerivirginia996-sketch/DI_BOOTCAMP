
# Challenge 1: Letter Index Dictionary
word = input("Enter a word: ")
letter_indices = {}

for index, character in enumerate(word):
	if character in letter_indices:
		letter_indices[character].append(index)
	else:
		letter_indices[character] = [index]

print(letter_indices)


# Challenge 2: Affordable Items
def get_affordable_items(items_purchase, wallet):
	wallet_amount = int(wallet.replace("$", "").replace(",", ""))
	basket = []

	for item, price_text in items_purchase.items():
		price = int(price_text.replace("$", "").replace(",", ""))

		if wallet_amount >= price:
			basket.append(item)
			wallet_amount -= price

	if not basket:
		return "Nothing"

	return sorted(basket)


items_1 = {"Water": "$1", "Bread": "$3", "TV": "$1,000", "Fertilizer": "$20"}
print(get_affordable_items(items_1, "$300"))

items_2 = {
	"Apple": "$4",
	"Honey": "$3",
	"Fan": "$14",
	"Bananas": "$4",
	"Pan": "$100",
	"Spoon": "$2",
}
print(get_affordable_items(items_2, "$100"))

items_3 = {
	"Phone": "$999",
	"Speakers": "$300",
	"Laptop": "$5,000",
	"PC": "$1200",
}
print(get_affordable_items(items_3, "$1"))

