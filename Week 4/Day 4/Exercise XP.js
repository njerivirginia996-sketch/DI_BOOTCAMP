//exercise 1
function compareToTen(num) {
  return new Promise((resolve, reject) => {
    if (num <= 10) {
      resolve(`${num} is less than or equal to 10`);
    } else {
      reject(`${num} is greater than 10`);
    }
  });
}

// Tests
compareToTen(15)
  .then(result => console.log(result))
  .catch(error => console.log(error));
// → "15 is greater than 10" (rejected, caught by .catch)

compareToTen(8)
  .then(result => console.log(result))
  .catch(error => console.log(error));
// → "8 is less than or equal to 10" (resolved, caught by .then)


//exercise 2
const delayedSuccess = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 4000);
});

delayedSuccess.then(result => console.log(result));
// → after 4 seconds: "success"


//exercise 3
const resolvedPromise = Promise.resolve(3);
resolvedPromise.then(value => console.log(value));
// → 3

const rejectedPromise = Promise.reject("Boo!");
rejectedPromise.catch(error => console.log(error));
// → "Boo!"