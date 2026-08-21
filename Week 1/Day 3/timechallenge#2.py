x = int(input("Enter the Number:"))

# Write down your logic here
divisors_sum = 0

for i in range(1, x):
    if x % i == 0:
        divisors_sum += i

is_perfect = divisors_sum == x

print(is_perfect)