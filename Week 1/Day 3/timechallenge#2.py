x = int(input("Enter the Number:"))

divisors_sum = 0

for i in range(1, x):
    if x % i == 0:
        divisors_sum += i

if divisors_sum == x and x > 0:
    print(True)
else:
    print(False)