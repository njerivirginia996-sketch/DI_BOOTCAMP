/* ============================================================
   🌟 Daily Challenge: Union Type Validator
   ============================================================ */
function validateUnionType(value: any, allowedTypes: string[]): boolean {
  const valueType = typeof value;

  for (const allowedType of allowedTypes) {
    if (valueType === allowedType) {
      return true;
    }
  }

  return false;
}

// Test the function with different variables and allowed types
console.log(validateUnionType(42, ["number", "string"]));        // Output: true
console.log(validateUnionType("Hello", ["number", "string"]));   // Output: true
console.log(validateUnionType(true, ["number", "string"]));      // Output: false
console.log(validateUnionType(true, ["boolean", "string"]));     // Output: true
console.log(validateUnionType([1, 2, 3], ["object", "string"])); // Output: true (arrays are typeof "object")
console.log(validateUnionType(undefined, ["undefined"]));        // Output: true
console.log(validateUnionType(null, ["object"]));                // Output: true (null is typeof "object")