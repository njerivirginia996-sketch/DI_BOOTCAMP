const crypto = require("crypto");
const express = require("express");
const { createGame, joinGame, validMoves, move, attack, publicGame } = require("../game");

const router = express.Router();
const users = new Map();
const tokens = new Map();
const games = new Map();

router.post("/register", (req, res) => {
    const username = typeof req.body.username === "string" ? req.body.username.trim() : "";
    const password = req.body.password;
    if (!/^[\w.-]{2,20}$/.test(username) || typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ error: "Choose a username (2-20 letters, numbers, dots, or dashes) and a password of at least 6 characters." });
    }
    const key = username.toLowerCase();
    if (users.has(key)) return res.status(409).json({ error: "That username is already registered." });

    const salt = crypto.randomBytes(16);
    const passwordHash = crypto.scryptSync(password, salt, 64);
    const user = { id: crypto.randomUUID(), username, salt: salt.toString("hex"), passwordHash: passwordHash.toString("hex") };
    users.set(key, user);
    return res.status(201).json({ id: user.id, username: user.username });
});

router.post("/login", (req, res) => {
    const username = typeof req.body.username === "string" ? req.body.username.trim() : "";
    const password = req.body.password;
    const user = users.get(username.toLowerCase());
    if (!user || typeof password !== "string") return res.status(401).json({ error: "Username or password is incorrect." });

    const candidate = crypto.scryptSync(password, Buffer.from(user.salt, "hex"), 64);
    const expected = Buffer.from(user.passwordHash, "hex");
    if (!crypto.timingSafeEqual(candidate, expected)) return res.status(401).json({ error: "Username or password is incorrect." });

    const token = crypto.randomUUID();
    tokens.set(token, { id: user.id, username: user.username });
    return res.json({ token, username: user.username });
});

router.use((req, res, next) => {
    const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
    const user = tokens.get(token);
    if (!user) return res.status(401).json({ error: "Log in to use the game API." });
    req.user = user;
    next();
});

router.get("/games", (req, res) => {
    const openGames = [...games.values()].filter((game) => game.status === "waiting").map(publicGame);
    res.json({ games: openGames });
});

router.post("/games", (req, res) => {
    const game = createGame(crypto.randomUUID(), req.user);
    games.set(game.id, game);
    res.status(201).json({ game: publicGame(game) });
});

router.post("/games/:id/join", (req, res) => {
    const game = games.get(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found." });
    try {
        joinGame(game, req.user);
        return res.json({ game: publicGame(game) });
    } catch (error) {
        return res.status(409).json({ error: error.message });
    }
});

router.get("/games/:id", (req, res) => {
    const game = games.get(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found." });
    res.json({ game: publicGame(game) });
});

router.get("/games/:id/valid-moves", (req, res) => {
    const game = games.get(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found." });
    try {
        return res.json({ moves: validMoves(game, req.user.id) });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.post("/games/:id/move", (req, res) => {
    const game = games.get(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found." });
    try {
        move(game, req.user.id, req.body.direction);
        return res.json({ game: publicGame(game) });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.post("/games/:id/attack", (req, res) => {
    const game = games.get(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found." });
    try {
        attack(game, req.user.id);
        return res.json({ game: publicGame(game) });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.get("/games/:id/winner", (req, res) => {
    const game = games.get(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found." });
    const winner = game.players.find((player) => player.id === game.winner) || null;
    res.json({ winner, status: game.status });
});

module.exports = router;
