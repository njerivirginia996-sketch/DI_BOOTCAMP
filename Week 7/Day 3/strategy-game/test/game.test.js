const test = require("node:test");
const assert = require("node:assert/strict");
const { createGame, joinGame, validMoves, move, attack } = require("../game");

function activeGame() {
    const game = createGame("match-1", { id: "p1", username: "North" });
    joinGame(game, { id: "p2", username: "South" });
    return game;
}

test("starts players on opposite corners with safe opening moves", () => {
    const game = activeGame();
    assert.deepEqual(game.positions, { p1: [0, 0], p2: [9, 9] });
    assert.equal(game.obstacles.length, 12);
    assert.deepEqual(validMoves(game, "p1").map((option) => option.direction).sort(), ["down", "right"]);
});

test("moves one square and enforces alternating turns", () => {
    const game = activeGame();
    move(game, "p1", "right");
    assert.deepEqual(game.positions.p1, [0, 1]);
    assert.equal(game.currentTurn, "p2");
    assert.throws(() => move(game, "p1", "right"), /not your turn/i);
});

test("rejects obstacle and off-board moves", () => {
    const game = activeGame();
    assert.throws(() => move(game, "p1", "left"), /valid move/i);
    assert.throws(() => move(game, "p1", "teleport"), /valid move/i);
});

test("wins by attacking an adjacent base", () => {
    const game = activeGame();
    game.obstacles = [];
    game.positions.p2 = [0, 1];
    game.currentTurn = "p2";
    attack(game, "p2");
    assert.equal(game.winner, "p2");
    assert.equal(game.status, "finished");
});

test("wins by moving onto the opponent base", () => {
    const game = activeGame();
    game.obstacles = [];
    game.bases.p2 = [1, 1];
    game.positions.p2 = [1, 1];
    game.positions.p1 = [1, 0];
    move(game, "p1", "right");
    assert.equal(game.winner, "p1");
    assert.deepEqual(game.positions.p1, [1, 1]);
});
