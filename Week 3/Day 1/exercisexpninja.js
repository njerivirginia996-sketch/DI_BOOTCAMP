//exercise 1
// 1 & 2. Create two objects with details and a method to calculate BMI
const person1 = {
  fullName: "John Doe",
  mass: 80, // in kg
  height: 1.8, // in meters
  calculateBMI: function () {
    this.bmi = this.mass / (this.height * this.height);
    return this.bmi;
  }
};

const person2 = {
  fullName: "Jane Smith",
  mass: 65, // in kg
  height: 1.6, // in meters
  calculateBMI: function () {
    this.bmi = this.mass / (this.height * this.height);
    return this.bmi;
  }
};

// 3. Create a function outside the objects to compare their BMIs
function compareBMI(obj1, obj2) {
  const bmi1 = obj1.calculateBMI();
  const bmi2 = obj2.calculateBMI();

  // 4. Display the name of the person with the largest BMI
  if (bmi1 > bmi2) {
    console.log(`${obj1.fullName} has the largest BMI (${bmi1.toFixed(2)}).`);
  } else if (bmi2 > bmi1) {
    console.log(`${obj2.fullName} has the largest BMI (${bmi2.toFixed(2)}).`);
  } else {
    console.log(`${obj1.fullName} and ${obj2.fullName} have the same BMI (${bmi1.toFixed(2)}).`);
  }
}

// Call the comparison function
compareBMI(person1, person2);


//exercise 2
```javascript
// Function 1: Calculate the average
function findAvg(gradesList) {
    let total = 0;

    for (let grade of gradesList) {
        total += grade;
    }

    let average = total / gradesList.length;

    console.log("Average:", average);

    // Call the second function
    checkResult(average);
}

// Function 2: Check if the student passed or failed
function checkResult(average) {
    if (average >= 65) {
        console.log("You passed!");
    } else {
        console.log("You failed and must repeat the course.");
    }
}

// Test
let grades = [70, 80, 60, 90, 75];

findAvg(grades);
```
