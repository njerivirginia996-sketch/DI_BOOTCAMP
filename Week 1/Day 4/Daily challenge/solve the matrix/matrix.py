MATRIX_STR = """
7ir
Tsi
h%x
i ?
sM# 
$a 
#t%"""

# 1) Convert the matrix string into a list of rows
rows = [line.rstrip() for line in MATRIX_STR.strip().splitlines() if line.strip()]
max_len = max(len(row) for row in rows)
matrix = [list(row.ljust(max_len)) for row in rows]

# 2) Read the matrix column by column and keep only letters
column_parts = []
for col in range(max_len):
    column = ''.join(matrix[row][col] for row in range(len(matrix)))
    letters = ''.join(ch for ch in column if ch.isalpha())
    if letters:
        column_parts.append(letters)

# 3) Print the decoded message
print(' '.join(column_parts))
