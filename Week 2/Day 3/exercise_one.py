# Option 1: import the whole module
import func

func.sum_numbers(3, 4)   # 7


# Option 2: import just the function
from func import sum_numbers

sum_numbers(10, 5)       # 15


# Option 3: import with an alias
import func as f

f.sum_numbers(20, 22)    # 42