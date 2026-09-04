//exercise 1
// 1. Get a random number between 1 and 100
const randomNumber = Math.floor(Math.random() * 100) + 1;
console.log("Random Number:", randomNumber);

// 2. Console.log all even numbers from 0 to randomNumber
for (let i = 0; i <= randomNumber; i += 2) {
  console.log(i);
}


//exercise 2
function capitalize(str) {
  let evenCapitalized = "";
  let oddCapitalized = "";

  for (let i = 0; i < str.length; i++) {
    if (i % 2 === 0) {
      evenCapitalized += str[i].toUpperCase();
      oddCapitalized += str[i].toLowerCase();
    } else {
      evenCapitalized += str[i].toLowerCase();
      oddCapitalized += str[i].toUpperCase();
    }
  }

  return [evenCapitalized, oddCapitalized];
}

// Example usage:
console.log(capitalize("abcdef")); // Output: ['AbCdEf', 'aBcDeF']


//exercise 3
function isPalindrome(str) {
  // Normalize string: convert to lowercase and remove non-alphanumeric characters
  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Reverse the string and check if it matches
  const reversedStr = cleanStr.split("").reverse().join("");
  
  return cleanStr === reversedStr;
}

// Example usage:
console.log(isPalindrome("madam")); // true
console.log(isPalindrome("kayak")); // true
console.log(isPalindrome("hello")); // false


//exercise 4
function biggestNumberInArray(arrayNumber) {
  let max = 0;

  for (let item of arrayNumber) {
    // Convert to number and check if valid
    const num = Number(item);
    if (!isNaN(num) && num > max) {
      max = num;
    }
  }

  return max;
}

// Example usage:
console.log(biggestNumberInArray([-1, 0, 3, 100, 99, 2, 99])); // 100
console.log(biggestNumberInArray(['a', 3, 4, 2]));             // 4
console.log(biggestNumberInArray([]));                          // 0


//exercise 5
function getUniqueElements(arr) {
  // Using Set to strip out duplicate values
  return [...new Set(arr)];
}

// Example usage:
const list = [1, 2, 3, 3, 3, 3, 4, 5];
console.log(getUniqueElements(list)); // [1, 2, 3, 4, 5]


//exercise 6
function createCalendar(year, month) {
  // month is 1-indexed (1 = Jan, 12 = Dec), convert to 0-indexed for JS Date
  const mon = month - 1; 
  const date = new Date(year, mon);

  // Create table element
  const table = document.createElement("table");
  
  // Table header row for weekdays
  const daysHeader = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  let headerRow = "<tr>";
  for (let day of daysHeader) {
    headerRow += `<th>${day}</th>`;
  }
  headerRow += "</tr>";
  table.innerHTML = headerRow;

  let row = document.createElement("tr");

  // Get day of week for the 1st of the month: 0 (Sun) to 6 (Sat)
  // Convert to Monday-first format: 0 (Mon) to 6 (Sun)
  let firstDay = date.getDay();
  let getDayMondayIndex = (firstDay === 0) ? 6 : firstDay - 1;

  // Add empty cells before the first day of the month
  for (let i = 0; i < getDayMondayIndex; i++) {
    const td = document.createElement("td");
    td.textContent = ".";
    row.appendChild(td);
  }

  // Fill in the dates of the month
  while (date.getMonth() === mon) {
    const td = document.createElement("td");
    td.textContent = date.getDate();
    row.appendChild(td);

    // If Sunday reached, append row to table and start a new row
    if ((date.getDay() === 0)) {
      table.appendChild(row);
      row = document.createElement("tr");
    }

    date.setDate(date.getDate() + 1);
  }

  // Fill remaining spaces in the last week with '.'
  if (row.children.length > 0) {
    while (row.children.length < 7) {
      const td = document.createElement("td");
      td.textContent = ".";
      row.appendChild(td);
    }
    table.appendChild(row);
  }

  // Append generated table to document body
  if (typeof document !== "undefined" && document.body) {
    document.body.appendChild(table);
  }
}

// Example usage:
if (typeof document !== "undefined") {
  createCalendar(2012, 9);
}