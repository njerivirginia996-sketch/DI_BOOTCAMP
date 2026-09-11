//exercise 2
let resolveAfter2Seconds = function () {
    console.log("starting slow promise");
    return new Promise(resolve => {
        setTimeout(function () {
            resolve("slow");
            console.log("slow promise is done");
        }, 2000);
    });
};

let resolveAfter1Second = function () {
    console.log("starting fast promise");
    return new Promise(resolve => {
        setTimeout(function () {
            resolve("fast");
            console.log("fast promise is done");
        }, 1000);
    });
};

let sequentialStart = async function () {
    console.log('==SEQUENTIAL START=='); // Output: "==SEQUENTIAL START==" (0ms)

    // await pauses execution here until resolveAfter2Seconds() resolves.
    // resolveAfter1Second() is NOT called yet — it won't start until this line finishes.
    const slow = await resolveAfter2Seconds();
    // Output: "starting slow promise" (0ms)
    // Output: "slow promise is done" (2000ms)
    console.log(slow); // Output: "slow" (2000ms)

    // Only NOW does resolveAfter1Second() get called — 2 seconds in
    const fast = await resolveAfter1Second();
    // Output: "starting fast promise" (2000ms)
    // Output: "fast promise is done" (3000ms)
    console.log(fast); // Output: "fast" (3000ms)
}

sequentialStart()

// Full console output, in order, with approximate timing:
// ==SEQUENTIAL START==       (0ms)
// starting slow promise      (0ms)
// slow promise is done       (2000ms)
// slow                       (2000ms)
// starting fast promise      (2000ms)
// fast promise is done       (3000ms)
// fast                       (3000ms)
//
// Total time: ~3 seconds (2s + 1s, run one after another)



//exercise 3
let concurrentStart = async function () {
    console.log('==CONCURRENT START with await=='); // Output: (4000ms, since setTimeout below delays the call)

    // Both functions are called WITHOUT await here, so both timers
    // start running in parallel immediately, back-to-back.
    const slow = resolveAfter2Seconds(); // Output: "starting slow promise" (4000ms)
    const fast = resolveAfter1Second();  // Output: "starting fast promise" (4000ms)

    // fast's 1-second timer finishes before slow's 2-second timer,
    // even though we await "slow" first.
    console.log(await slow);
    // Output: "fast promise is done"   (5000ms, finishes while we're still waiting on slow)
    // Output: "slow promise is done"   (6000ms)
    // Output: "slow"                   (6000ms)

    console.log(await fast); // fast already resolved a while ago, so this returns instantly
    // Output: "fast"                   (6000ms)
}

setTimeout(concurrentStart, 4000)

// Full console output, in order, with approximate timing:
// ==CONCURRENT START with await==   (4000ms)
// starting slow promise             (4000ms)
// starting fast promise             (4000ms)
// fast promise is done              (5000ms)
// slow promise is done              (6000ms)
// slow                              (6000ms)
// fast                              (6000ms)
//
// Total time from concurrentStart() running: ~2 seconds (not 3!)
// Because both timers start at the same time and run in parallel,
// the total wait is just the length of the LONGER one (2s).



//exercise 4
const urls = [
    "https://jsonplaceholder.typicode.com/users",
    "https://jsonplaceholder.typicode.com/posts",
    "https://jsonplaceholder.typicode.com/albums"
];

const getData = async function () {
  try {
    const [users, posts, albums] = await Promise.all(
      urls.map(async url => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
      })
    );

    console.log('users', users);
    console.log('posts', posts);
    console.log('albums', albums);

  } catch (error) {
    console.log('ooooooops');
    console.error(error);
  }
};

getData();