//exercise 1
function isBlank(str) {
  return str.length === 0;
}

// Tests
console.log(isBlank(''));    // --> true
console.log(isBlank('abc')); // --> false


//exercise 2
function abbrevName(name) {
  let parts = name.trim().split(" ");
  if (parts.length > 1) {
    return `${parts[0]} ${parts[1][0]}.`;
  }
  return parts[0];
}

// Test
console.log(abbrevName("Robin Singh")); // --> "Robin S."


//exercise 3
function swapCase(str) {
  let result = "";
  for (let char of str) {
    if (char === char.toUpperCase()) {
      result += char.toLowerCase();
    } else {
      result += char.toUpperCase();
    }
  }
  return result;
}

// Test
console.log(swapCase('The Quick Brown Fox')); // --> 'tHE qUICK bROWN fOX'


//exercise 4
function isOmnipresent(arr, val) {
  // Check if EVERY sub-array contains the given value
  return arr.every(subArr => subArr.includes(val));
}

// Tests
console.log(isOmnipresent([[1, 1], [1, 3], [5, 1], [6, 1]], 1)); // --> true
console.log(isOmnipresent([[1, 1], [1, 3], [5, 1], [6, 1]], 6)); // --> false


//exercise 5
const table = document.querySelector("table");

if (table) {
  for (let i = 0; i < table.rows.length; i++) {
    if (table.rows[i].cells[i]) {
      table.rows[i].cells[i].style.backgroundColor = "red";
    }
  }
} else {
  console.log("No table found in the page.");
}