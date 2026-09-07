// ============================================
// EXERCISE DATA
// ============================================

const gameInfo = [
  { username: "john", team: "red", score: 5, items: ["ball", "book", "pen"] },
  { username: "becky", team: "blue", score: 10, items: ["tape", "backpack", "pen"] },
  { username: "susy", team: "red", score: 55, items: ["ball", "eraser", "pen"] },
  { username: "tyson", team: "green", score: 1, items: ["book", "pen"] },
];

// ============================================
// EXERCISE 1: Usernames with exclamation points
// ============================================

const usernames = [];

gameInfo.forEach(player => {
  usernames.push(`${player.username}!`);
});

console.log("Exercise 1 - Usernames:", usernames);
// ["john!", "becky!", "susy!", "tyson!"]


// ============================================
// EXERCISE 2: Usernames of players with score > 5
// ============================================

const winners = [];

gameInfo.forEach(player => {
  if (player.score > 5) {
    winners.push(player.username);
  }
});

console.log("Exercise 2 - Winners:", winners);
// ["becky", "susy"]


// ============================================
// EXERCISE 3: Total score of all users
// ============================================

let totalScore = 0;

gameInfo.forEach(player => {
  totalScore += player.score;
});

console.log("Exercise 3 - Total score:", totalScore);
// 71


// ============================================
// BONUS: Same 3 exercises using map/filter/reduce
// ============================================

const usernames2 = gameInfo.map(player => `${player.username}!`);

const winners2 = gameInfo
  .filter(player => player.score > 5)
  .map(player => player.username);

const totalScore2 = gameInfo.reduce((sum, player) => sum + player.score, 0);

console.log("Bonus - Usernames (map):", usernames2);
console.log("Bonus - Winners (filter+map):", winners2);
console.log("Bonus - Total score (reduce):", totalScore2);