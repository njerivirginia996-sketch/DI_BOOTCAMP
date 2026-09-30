const state = {
    token: localStorage.getItem("grid-capture-token"),
    username: localStorage.getItem("grid-capture-username"),
    registering: false,
    gameId: null,
    game: null,
    validMoves: [],
    pollTimer: null,
};

const elements = Object.fromEntries([
    "auth-view", "lobby-view", "game-view", "auth-form", "auth-title", "auth-submit", "switch-auth", "switch-prompt", "auth-error", "username", "password", "signed-in-name", "sign-out", "create-game", "created-game", "game-code", "copy-code", "open-games", "refresh-games", "join-form", "game-code-input", "lobby-notice", "back-lobby", "match-code", "copy-match-code", "game-status", "turn-label", "player-list", "board", "attack", "game-notice",
].map((id) => [id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), document.getElementById(id)]));

const directionButtons = [...document.querySelectorAll("[data-direction]")];

elements.switchAuth.addEventListener("click", () => {
    state.registering = !state.registering;
    elements.authTitle.textContent = state.registering ? "Create your player" : "Sign in to play";
    elements.authSubmit.innerHTML = state.registering ? "Create account <span aria-hidden=\"true\">↗</span>" : "Sign in <span aria-hidden=\"true\">↗</span>";
    elements.switchPrompt.textContent = state.registering ? "Already registered?" : "New to the board?";
    elements.switchAuth.textContent = state.registering ? "Sign in" : "Create account";
    elements.password.autocomplete = state.registering ? "new-password" : "current-password";
    elements.authError.textContent = "";
});

elements.authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    elements.authError.textContent = "";
    const credentials = { username: elements.username.value.trim(), password: elements.password.value };
    try {
        if (state.registering) await request("/api/register", { method: "POST", body: credentials });
        const result = await request("/api/login", { method: "POST", body: credentials });
        state.token = result.token;
        state.username = result.username;
        localStorage.setItem("grid-capture-token", state.token);
        localStorage.setItem("grid-capture-username", state.username);
        await showLobby();
    } catch (error) {
        elements.authError.textContent = error.message;
    }
});

elements.signOut.addEventListener("click", () => {
    stopPolling();
    state.token = null;
    state.username = null;
    state.game = null;
    localStorage.removeItem("grid-capture-token");
    localStorage.removeItem("grid-capture-username");
    showAuth();
});

elements.createGame.addEventListener("click", async () => {
    setLobbyNotice("");
    try {
        const { game } = await request("/api/games", { method: "POST" });
        elements.gameCode.textContent = game.id;
        elements.createdGame.classList.remove("hidden");
        await openGame(game.id);
    } catch (error) {
        setLobbyNotice(error.message);
    }
});

elements.copyCode.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(elements.gameCode.textContent);
        setLobbyNotice("Match code copied.");
    } catch {
        setLobbyNotice("Match code: " + elements.gameCode.textContent);
    }
});

elements.copyMatchCode.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(state.gameId);
        elements.gameNotice.textContent = "Full match code copied.";
    } catch {
        elements.gameNotice.textContent = `Match code: ${state.gameId}`;
    }
});

elements.refreshGames.addEventListener("click", loadGames);
elements.joinForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = elements.gameCodeInput.value.trim();
    if (id) await joinGame(id);
});
elements.openGames.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-game-id]");
    if (button) joinGame(button.dataset.gameId);
});
elements.backLobby.addEventListener("click", () => {
    stopPolling();
    state.gameId = null;
    state.game = null;
    showLobby();
});
directionButtons.forEach((button) => {
    button.addEventListener("click", () => submitMove(button.dataset.direction));
});
elements.attack.addEventListener("click", submitAttack);

async function request(url, options = {}) {
    const headers = { "Content-Type": "application/json" };
    if (state.token) headers.Authorization = `Bearer ${state.token}`;
    const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "The request could not be completed.");
    return data;
}

function showAuth() {
    elements.authView.classList.remove("hidden");
    elements.lobbyView.classList.add("hidden");
    elements.gameView.classList.add("hidden");
}

async function showLobby() {
    elements.authView.classList.add("hidden");
    elements.gameView.classList.add("hidden");
    elements.lobbyView.classList.remove("hidden");
    elements.signedInName.textContent = state.username;
    elements.createdGame.classList.add("hidden");
    setLobbyNotice("");
    await loadGames();
}

async function loadGames() {
    try {
        const { games } = await request("/api/games");
        elements.openGames.replaceChildren();
        if (!games.length) {
            const empty = document.createElement("li");
            empty.className = "empty-list";
            empty.textContent = "No open matches right now.";
            elements.openGames.append(empty);
            return;
        }
        for (const game of games) {
            const row = document.createElement("li");
            const owner = document.createElement("span");
            owner.textContent = `${game.players[0].username} · ${game.id.slice(0, 8)}`;
            const join = document.createElement("button");
            join.type = "button";
            join.dataset.gameId = game.id;
            join.textContent = "Join match";
            row.append(owner, join);
            elements.openGames.append(row);
        }
    } catch (error) {
        setLobbyNotice(error.message);
        if (error.message.includes("Log in")) showAuth();
    }
}

async function joinGame(id) {
    setLobbyNotice("");
    try {
        const { game } = await request(`/api/games/${encodeURIComponent(id)}/join`, { method: "POST" });
        await openGame(game.id);
    } catch (error) {
        setLobbyNotice(error.message);
    }
}

async function openGame(id) {
    state.gameId = id;
    elements.lobbyView.classList.add("hidden");
    elements.authView.classList.add("hidden");
    elements.gameView.classList.remove("hidden");
    elements.matchCode.textContent = id.slice(0, 8).toUpperCase();
    await refreshGame();
    stopPolling();
    state.pollTimer = window.setInterval(refreshGame, 1800);
}

async function refreshGame() {
    if (!state.gameId) return;
    try {
        const { game } = await request(`/api/games/${encodeURIComponent(state.gameId)}`);
        state.game = game;
        const me = game.players.find((player) => player.username === state.username);
        if (game.status === "active" && me?.id === game.currentTurn) {
            const legalMoves = await request(`/api/games/${encodeURIComponent(state.gameId)}/valid-moves`);
            state.validMoves = legalMoves.moves;
        } else {
            state.validMoves = [];
        }
        elements.gameNotice.textContent = "";
        renderGame();
    } catch (error) {
        elements.gameNotice.textContent = error.message;
        if (error.message.includes("Log in")) showAuth();
    }
}

function renderGame() {
    const game = state.game;
    if (!game) return;
    const me = game.players.find((player) => player.username === state.username);
    const myTurn = game.status === "active" && me?.id === game.currentTurn;
    const canAttack = myTurn && isAdjacentToOpponentBase(game, me.id);

    elements.gameStatus.textContent = game.status === "waiting" ? "Waiting for opponent" : game.status === "finished" ? `${playerName(game, game.winner)} captured the base` : "Capture the opponent base";
    elements.turnLabel.textContent = game.status === "waiting" ? "Waiting for player two" : game.status === "finished" ? "Match complete" : myTurn ? "Your turn" : `${playerName(game, game.currentTurn)} is thinking`;
    elements.playerList.replaceChildren(...game.players.map((player, index) => {
        const row = document.createElement("div");
        row.className = "player-row";
        const swatch = document.createElement("i");
        swatch.className = `player-swatch${index ? " second" : ""}`;
        const name = document.createElement("span");
        name.textContent = player.username;
        const label = document.createElement("small");
        label.textContent = index ? "P2" : "P1";
        row.append(swatch, name, label);
        return row;
    }));
    directionButtons.forEach((button) => {
        button.disabled = !myTurn || !gameHasDirection(button.dataset.direction);
    });
    elements.attack.disabled = !canAttack;
    drawBoard(game);
}

function drawBoard(game) {
    const obstacleKeys = new Set(game.obstacles.map(([row, column]) => `${row},${column}`));
    const baseKeys = new Set(Object.values(game.bases).map(([row, column]) => `${row},${column}`));
    const playerAt = new Map(Object.entries(game.positions).map(([id, position]) => [`${position[0]},${position[1]}`, id]));
    const cells = [];
    for (let row = 0; row < 10; row += 1) {
        for (let column = 0; column < 10; column += 1) {
            const key = `${row},${column}`;
            const cell = document.createElement("div");
            cell.className = "cell";
            if (obstacleKeys.has(key)) cell.classList.add("obstacle");
            if (baseKeys.has(key)) {
                const base = document.createElement("span");
                base.className = "base-mark";
                base.textContent = "BASE";
                cell.append(base);
            }
            const playerId = playerAt.get(key);
            if (playerId) {
                cell.classList.add("has-piece");
                const piece = document.createElement("span");
                piece.className = `piece${game.players[1]?.id === playerId ? " second" : " first"}`;
                piece.textContent = game.players.findIndex((player) => player.id === playerId) + 1;
                cell.append(piece);
            }
            cells.push(cell);
        }
    }
    elements.board.replaceChildren(...cells);
}

async function submitMove(direction) {
    await performAction(`/api/games/${encodeURIComponent(state.gameId)}/move`, { direction });
}

async function submitAttack() {
    await performAction(`/api/games/${encodeURIComponent(state.gameId)}/attack`);
}

async function performAction(url, body) {
    elements.gameNotice.textContent = "";
    try {
        const { game } = await request(url, { method: "POST", body });
        state.game = game;
        renderGame();
    } catch (error) {
        elements.gameNotice.textContent = error.message;
        await refreshGame();
    }
}

function isAdjacentToOpponentBase(game, playerId) {
    const opponent = game.players.find((player) => player.id !== playerId);
    const [row, column] = game.positions[playerId];
    const [baseRow, baseColumn] = game.bases[opponent.id];
    return Math.abs(row - baseRow) + Math.abs(column - baseColumn) === 1;
}

function playerName(game, id) {
    return game.players.find((player) => player.id === id)?.username || "A player";
}

function gameHasDirection(direction) {
    return state.validMoves.some((move) => move.direction === direction);
}

function setLobbyNotice(message) {
    elements.lobbyNotice.textContent = message;
}

function stopPolling() {
    if (state.pollTimer) window.clearInterval(state.pollTimer);
    state.pollTimer = null;
}

if (state.token && state.username) showLobby().catch(() => showAuth());
else showAuth();
