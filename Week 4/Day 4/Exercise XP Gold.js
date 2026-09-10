//exercise 1
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'foo');
});

Promise.all([promise1, promise2, promise3])
  .then(values => {
    console.log(values);
  })
  .catch(error => {
    console.log(error);
  });

// expected output: Array [3, 42, "foo"]

/*
How Promise.all() works:

- Promise.all() takes an iterable (here, an array) of promises (or values)
  and returns a single new promise.

- It runs all the promises concurrently, not one after another. Since
  promise3's setTimeout starts counting as soon as Promise.all() is called
  (not after promise1 finishes), the total wait is ~3 seconds, not 3+ seconds
  stacked on top of each other.

- Non-promise values in the array (like promise2 = 42) are treated as
  already-resolved values. They are passed straight through unchanged.

- The returned promise RESOLVES only when *all* promises in the array have
  resolved. Its resolved value is an array of the individual resolved
  values, in the SAME ORDER as the input array — regardless of which
  promise actually finished first. That's why the output is
  [3, 42, "foo"] and not, say, "foo" first even though it took the longest
  to settle.

- The returned promise REJECTS as soon as *any* one of the promises
  rejects (fail-fast behavior), with that promise's rejection reason.
  It does not wait for the others to finish. That's why we attach a
  .catch() — to handle the case where one of the three fails.
*/


//exercise 2
function timesTwoAsync(x) {
  return new Promise(resolve => resolve(x * 2));
}

const arr = [1, 2, 3];
const promiseArr = arr.map(timesTwoAsync);

Promise.all(promiseArr)
  .then(result => {
    console.log(result);
  });

// Output: [2, 4, 6]