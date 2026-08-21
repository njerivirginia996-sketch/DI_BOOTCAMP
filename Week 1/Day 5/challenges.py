#exercise 1
my_list = [10, 20, 30, 40]
item = "hello"
index = 2
my_list.insert(index, item)
print(my_list)  

#exercise 2
text = "Hello world from Python"
space_count = text.count(" ")
print(space_count)  

#exercise 3
text = "Hello World!"
upper_count = sum(1 for c in text if c.isupper())
lower_count = sum(1 for c in text if c.islower())
print(f"Upper: {upper_count}, Lower: {lower_count}")

#exercise 4
def my_sum(lst):
    total = 0
    for num in lst:
        total += num
    return total
print(my_sum([1, 5, 4, 2]))

#exercise 5
def find_max(lst):
    max_val = lst[0]
    for num in lst[1:]:
        if num > max_val:
            max_val = num
    return max_val
print(find_max([0, 1, 3, 50]))  

#exercise 6
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
print(factorial(4)) 

#exercise 7
def list_count(lst, element):
    count = 0
    for item in lst:
        if item == element:
            count += 1
    return count
print(list_count(["a", "a", "t", "o"], "a")) 

#exercise 8
def norm(lst):
    sum_of_squares = sum(x**2 for x in lst)
    return int(sum_of_squares**0.5)
print(norm([1, 2, 2])) 

#exercise 9
def is_mono(lst):
    increasing = all(lst[i] <= lst[i + 1] for i in range(len(lst) - 1))
    decreasing = all(lst[i] >= lst[i + 1] for i in range(len(lst) - 1))
    return increasing or decreasing
print(is_mono([7, 6, 5, 5, 2, 0])) 
print(is_mono([1, 2, 0, 4]))  

#exercise 10
def print_longest(words):
    longest = max(words, key=len)
    print(longest)
print_longest(["apple", "banana", "watermelon", "kiwi"])

#exercise 11
mixed_list = [10, "hello", 20, "world", 30]
integers = [x for x in mixed_list if isinstance(x, int)]
strings = [x for x in mixed_list if isinstance(x, str)]
print(integers, strings)

#exercise 12
def is_palindrome(s):
    cleaned = s.lower()
    return cleaned == cleaned[::-1]
print(is_palindrome("radar"))
print(is_palindrome("John")) 

#exercise 13
def sum_over_k(sentence, k):
    words = sentence.split()
    return sum(1 for word in words if len(word) > k)
print(sum_over_k("Do or do not there is no try", 2))

#exercise 14
def dict_avg(d):
    return sum(d.values()) / len(d)
print(dict_avg({"a": 1, "b": 2, "c": 8, "d": 1})) 

#exercise 15
def common_div(a, b):
    return [i for i in range(2, min(a, b) + 1) if a % i == 0 and b % i == 0]
print(common_div(10, 20))

#exercise 16
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True
print(is_prime(11))

#exercise 17
def weird_print(lst):
    result = [val for idx, val in enumerate(lst) if idx % 2 == 0 and val % 2 == 0]
    print(result)
weird_print([1, 2, 2, 3, 4, 5])

#exercise 18
def type_count(**kwargs):
    counts = {}
    for value in kwargs.values():
        t_name = type(value).__name__
        counts[t_name] = counts.get(t_name, 0) + 1
    return ", ".join(f"{k}: {v}" for k, v in counts.items())
print(
    type_count(a=1, b="string", c=1.0, d=True, e=False)
) 

#exercise 19
def custom_split(text, delimiter=None):
    result = []
    current = []
    for char in text:
        if (delimiter is None and char.isspace()) or (
            delimiter and char == delimiter
        ):
            if current:
                result.append("".join(current))
                current = []
        else:
            current.append(char)
    if current:
        result.append("".join(current))
    return result
print(custom_split("hello world python"))

#exercise 20
def mask_password(password):
    return "*" * len(password)
print(mask_password("mypassword"))