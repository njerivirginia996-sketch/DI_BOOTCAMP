const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();
const usersFile = process.env.USERS_FILE || path.join(__dirname, "..", "users.json");
let mutationQueue = Promise.resolve();
const SALT_ROUNDS = 10;

function asyncRoute(handler) {
    return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

async function readUsers() {
    try {
        const content = await fs.readFile(usersFile, "utf8");
        const users = JSON.parse(content);
        if (!Array.isArray(users)) throw new Error("Users file must contain a JSON array.");
        return users;
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
}

async function writeUsers(users) {
    const temporaryFile = `${usersFile}.${process.pid}.${crypto.randomUUID()}.tmp`;
    await fs.writeFile(temporaryFile, `${JSON.stringify(users, null, 2)}\n`, "utf8");
    await fs.rename(temporaryFile, usersFile);
}

function serializeMutation(operation) {
    const result = mutationQueue.then(operation);
    mutationQueue = result.catch(() => {});
    return result;
}

function publicUser(user) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
}

function cleanText(value) {
    return typeof value === "string" ? value.trim() : "";
}

function validateProfile(profile, partial = false) {
    const fields = ["name", "lastName", "email", "username", "password"];
    if (!partial && fields.some((field) => !cleanText(profile[field]))) {
        const error = new Error("Name, last name, email, username, and password are required.");
        error.status = 400;
        throw error;
    }

    for (const field of fields) {
        if (profile[field] !== undefined && typeof profile[field] !== "string") {
            const error = new Error(`${field} must be a string.`);
            error.status = 400;
            throw error;
        }
    }
    if (profile.name !== undefined && (cleanText(profile.name).length < 1 || cleanText(profile.name).length > 50)) {
        const error = new Error("Name must be between 1 and 50 characters.");
        error.status = 400;
        throw error;
    }
    if (profile.lastName !== undefined && (cleanText(profile.lastName).length < 1 || cleanText(profile.lastName).length > 50)) {
        const error = new Error("Last name must be between 1 and 50 characters.");
        error.status = 400;
        throw error;
    }
    if (profile.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText(profile.email))) {
        const error = new Error("Enter a valid email address.");
        error.status = 400;
        throw error;
    }
    if (profile.username !== undefined && !/^[\w.-]{2,20}$/.test(cleanText(profile.username))) {
        const error = new Error("Username must be 2-20 letters, numbers, dots, or dashes.");
        error.status = 400;
        throw error;
    }
    if (profile.password !== undefined && cleanText(profile.password).length < 6) {
        const error = new Error("Password must be at least 6 characters.");
        error.status = 400;
        throw error;
    }
}

async function passwordAlreadyUsed(users, password, excludedId) {
    const candidates = users.filter((user) => user.id !== excludedId);
    const matches = await Promise.all(candidates.map((user) => bcrypt.compare(password, user.passwordHash)));
    return matches.some(Boolean);
}

router.post("/register", asyncRoute(async (req, res) => {
    const input = req.body || {};
    validateProfile(input);
    const profile = {
        name: cleanText(input.name),
        lastName: cleanText(input.lastName),
        email: cleanText(input.email).toLowerCase(),
        username: cleanText(input.username),
        password: input.password,
    };

    const user = await serializeMutation(async () => {
        const users = await readUsers();
        const duplicateUsername = users.some((existing) => existing.username.toLowerCase() === profile.username.toLowerCase());
        const duplicateEmail = users.some((existing) => existing.email === profile.email);
        const duplicatePassword = await passwordAlreadyUsed(users, profile.password);
        if (duplicateUsername || duplicateEmail || duplicatePassword) {
            const error = new Error("Username, email, or password already exists.");
            error.status = 409;
            throw error;
        }

        const created = {
            id: crypto.randomUUID(),
            name: profile.name,
            lastName: profile.lastName,
            email: profile.email,
            username: profile.username,
            passwordHash: await bcrypt.hash(profile.password, SALT_ROUNDS),
        };
        users.push(created);
        await writeUsers(users);
        return created;
    });

    res.status(201).json({ message: "User registered successfully.", user: publicUser(user) });
}));

router.post("/login", asyncRoute(async (req, res) => {
    const username = cleanText(req.body?.username);
    const password = req.body?.password;
    if (!username || typeof password !== "string" || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    const users = await readUsers();
    const user = users.find((candidate) => candidate.username.toLowerCase() === username.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: "Invalid username or password." });
    }
    res.json({ message: "Login successful.", user: publicUser(user) });
}));

router.get("/users", asyncRoute(async (req, res) => {
    const users = await readUsers();
    res.json({ users: users.map(publicUser) });
}));

router.get("/users/:id", asyncRoute(async (req, res) => {
    const users = await readUsers();
    const user = users.find((candidate) => candidate.id === req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user: publicUser(user) });
}));

router.put("/users/:id", asyncRoute(async (req, res) => {
    const input = req.body || {};
    const allowedFields = ["name", "lastName", "email", "username", "password"];
    const changes = Object.fromEntries(Object.entries(input).filter(([key]) => allowedFields.includes(key)));
    if (Object.keys(changes).length === 0) return res.status(400).json({ error: "Provide at least one user field to update." });
    validateProfile(changes, true);

    const updated = await serializeMutation(async () => {
        const users = await readUsers();
        const user = users.find((candidate) => candidate.id === req.params.id);
        if (!user) {
            const error = new Error("User not found.");
            error.status = 404;
            throw error;
        }

        if (changes.username && users.some((candidate) => candidate.id !== user.id && candidate.username.toLowerCase() === cleanText(changes.username).toLowerCase())) {
            const error = new Error("Username already exists.");
            error.status = 409;
            throw error;
        }
        if (changes.email) {
            const email = cleanText(changes.email).toLowerCase();
            if (users.some((candidate) => candidate.id !== user.id && candidate.email === email)) {
                const error = new Error("Email already exists.");
                error.status = 409;
                throw error;
            }
            user.email = email;
        }
        if (changes.password && await passwordAlreadyUsed(users, changes.password, user.id)) {
            const error = new Error("Password already exists.");
            error.status = 409;
            throw error;
        }

        for (const field of ["name", "lastName", "username"]) {
            if (changes[field] !== undefined) user[field] = cleanText(changes[field]);
        }
        if (changes.password !== undefined) user.passwordHash = await bcrypt.hash(changes.password, SALT_ROUNDS);
        await writeUsers(users);
        return user;
    });

    res.json({ message: "User updated successfully.", user: publicUser(updated) });
}));

module.exports = router;
