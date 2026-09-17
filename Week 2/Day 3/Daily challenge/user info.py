def collect_users(number_of_users=5):
	users = []

	for user_number in range(1, number_of_users + 1):
		while True:
			user_input = input(
				f"Enter name, age, and score for user {user_number} "
				"(separated by commas): "
			)
			values = [value.strip() for value in user_input.split(",")]

			if len(values) != 3 or not values[0]:
				print("Please enter a name, age, and score separated by commas.")
				continue

			try:
				int(values[1])
				int(values[2])
			except ValueError:
				print("Age and score must be integers.")
				continue

			users.append((values[0], values[1], values[2]))
			break

	users.sort(key=lambda user: (user[0], int(user[1]), int(user[2])))
	return users


if __name__ == "__main__":
	print(collect_users())
