#exercise 1
print(("Hello world\n" * 4 + "I love python\n" * 4).strip())

#exercise 2
month = int(input("Enter a month number (1 to 12): "))
if 3 <= month <= 5:
    print("Spring")
elif 6 <= month <= 8:
    print("Summer")
elif 9 <= month <= 11:
    print("Autumn")
elif month == 12 or month == 1 or month == 2:
    print("Winter")
else:
    print("Invalid month! Please enter a number between 1 and 12.")