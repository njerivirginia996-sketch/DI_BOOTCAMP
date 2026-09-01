const numbers = [5, 0, 9, 1, 7, 4, 2, 6, 3, 8];

// ==========================================
// 1. Using .toString()
// ==========================================
// Converts the array into a comma-separated string
const stringResult = numbers.toString();
console.log("1. Using .toString():", stringResult); 
// Output: "5,0,9,1,7,4,2,6,3,8"


// ==========================================
// 2. Using .join()
// ==========================================
// Converts the array to a string using different custom separators
const joinPlus = numbers.join("+");
console.log("2a. Using .join('+'):", joinPlus); 
// Output: "5+0+9+1+7+4+2+6+3+8"

const joinSpace = numbers.join(" ");
console.log("2b. Using .join(' '):", joinSpace); 
// Output: "5 0 9 1 7 4 2 6 3 8"

const joinEmpty = numbers.join("");
console.log("2c. Using .join(''):", joinEmpty); 
// Output: "5091742638"


// ==========================================
// 3. Bonus: Bubble Sort (Descending Order)
// ==========================================
console.log("\n--- Starting Bubble Sort ---");

// Outer loop controls the number of total passes needed over the array
for (let i = 0; i < numbers.length; i++) {
  
  // Inner loop compares adjacent elements in the array
  for (let j = 0; j < numbers.length - 1; j++) {
    
    // For descending order, check if the current number is SMALLER than the next number
    if (numbers[j] < numbers[j + 1]) {
      
      // Store the current number in a temporary variable before swapping
      let temp = numbers[j];
      
      // Swap the smaller value to the right
      numbers[j] = numbers[j + 1];
      
      // Place the saved value into the next position
      numbers[j + 1] = temp;
      
      // Log array state after every successful swap
      console.log(`Swapped ${numbers[j + 1]} and ${numbers[j]}:`, numbers);
    }
  }
}

// Final output verification
console.log("\nFinal Descending Sorted Array:", numbers);
// Expected Output: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]