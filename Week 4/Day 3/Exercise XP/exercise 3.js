const marioGame = {
    detail: "An amazing game!",
    characters: {
        mario: {
            description: "Small and jumpy. Likes princesses.",
            height: 10,
            weight: 3,
            speed: 12
        },
        bowser: {
            description: "Big and green. Hates princesses.",
            height: 16,
            weight: 6,
            speed: 4
        },
        princessPeach: {
            description: "Beautiful princess.",
            height: 12,
            weight: 2,
            speed: 2
        }
    }
};

// Exercise 3.1
const marioJSON = JSON.stringify(marioGame);
console.log(marioJSON);

// Exercise 3.2 - Pretty print
const prettyMarioJSON = JSON.stringify(marioGame, null, 2);
console.log(prettyMarioJSON);

// Exercise 3.3
// Add a breakpoint on the line above and inspect
// marioGame and prettyMarioJSON in the debugger.