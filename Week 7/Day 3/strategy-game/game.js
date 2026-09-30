const BOARD_SIZE = 10;
const OBSTACLE_COUNT = 12;
const DIRECTIONS = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
};

function createGame(id, creator) {
    return {
        id,
        players: [{ id: creator.id, username: creator.username }],
        positions: { [creator.id]: [0, 0] },
        bases: { [creator.id]: [0, 0] },
        obstacles: createObstacles(),
        currentTurn: creator.id,
        winner: null,
        status: "waiting",
    };
}

function joinGame(game, player) {
    if (game.status !== "waiting") throw new Error("This game is not waiting for a player.");
    if (game.players.some((existing) => existing.id === player.id)) throw new Error("You are already in this game.");

    game.players.push({ id: player.id, username: player.username });
    game.positions[player.id] = [BOARD_SIZE - 1, BOARD_SIZE - 1];
    game.bases[player.id] = [BOARD_SIZE - 1, BOARD_SIZE - 1];
    game.status = "active";
    return game;
}

function validMoves(game, playerId) {
    assertActiveTurn(game, playerId);
    const [row, column] = game.positions[playerId];
    return Object.entries(DIRECTIONS)
        .map(([direction, [rowStep, columnStep]]) => ({ direction, position: [row + rowStep, column + columnStep] }))
        .filter(({ position }) => isOnBoard(position) && !isObstacle(game, position) && !isOccupied(game, playerId, position));
}

function move(game, playerId, direction) {
    const options = validMoves(game, playerId);
    const destination = options.find((option) => option.direction === direction);
    if (!destination) throw new Error("That is not a valid move.");

    const opponent = otherPlayer(game, playerId);
    game.positions[playerId] = destination.position;
    if (sameCell(destination.position, game.bases[opponent.id])) {
        game.winner = playerId;
        game.status = "finished";
    } else {
        game.currentTurn = opponent.id;
    }
    return game;
}

function attack(game, playerId) {
    assertActiveTurn(game, playerId);
    const opponent = otherPlayer(game, playerId);
    const [row, column] = game.positions[playerId];
    const [baseRow, baseColumn] = game.bases[opponent.id];
    if (Math.abs(row - baseRow) + Math.abs(column - baseColumn) !== 1) {
        throw new Error("Move next to the opponent's base before attacking.");
    }

    game.winner = playerId;
    game.status = "finished";
    return game;
}

function assertActiveTurn(game, playerId) {
    if (game.status !== "active") throw new Error("This game is not active.");
    if (!game.players.some((player) => player.id === playerId)) throw new Error("You are not a player in this game.");
    if (game.currentTurn !== playerId) throw new Error("It is not your turn.");
}

function otherPlayer(game, playerId) {
    return game.players.find((player) => player.id !== playerId);
}

function isOnBoard([row, column]) {
    return row >= 0 && row < BOARD_SIZE && column >= 0 && column < BOARD_SIZE;
}

function sameCell(first, second) {
    return first[0] === second[0] && first[1] === second[1];
}

function isObstacle(game, cell) {
    return game.obstacles.some((obstacle) => sameCell(obstacle, cell));
}

function isOccupied(game, playerId, cell) {
    return game.players.some((player) => player.id !== playerId && sameCell(game.positions[player.id], cell)
        && !sameCell(game.bases[player.id], cell));
}

function createObstacles() {
    const reserved = new Set(["0,0", "0,1", "1,0", "9,9", "9,8", "8,9"]);
    const obstacles = [];
    while (obstacles.length < OBSTACLE_COUNT) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const column = Math.floor(Math.random() * BOARD_SIZE);
        const key = `${row},${column}`;
        if (!reserved.has(key)) {
            reserved.add(key);
            obstacles.push([row, column]);
        }
    }
    return obstacles;
}

function publicGame(game) {
    return {
        id: game.id,
        players: game.players,
        positions: game.positions,
        bases: game.bases,
        obstacles: game.obstacles,
        currentTurn: game.currentTurn,
        winner: game.winner,
        status: game.status,
    };
}

module.exports = { createGame, joinGame, validMoves, move, attack, publicGame };
