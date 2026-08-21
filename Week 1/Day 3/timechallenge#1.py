REverseinp = raw_input()

# Write down your logic here
words = REverseinp.split()
reversed_words = words[::-1]
reversed = " ".join(reversed_words)

print(reversed)