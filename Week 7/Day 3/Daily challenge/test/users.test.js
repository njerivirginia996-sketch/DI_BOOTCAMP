const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const bcrypt = require("bcrypt");

const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "user-api-"));
const usersFile = path.join(temporaryDirectory, "users.json");
process.env.USERS_FILE = usersFile;
const app = require("../server");

test("user forms and management API validate and persist hashed accounts", async (context) => {
    const server = app.listen(0);
    context.after(() => new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    }));
    context.after(() => {
        delete process.env.USERS_FILE;
        fs.rmSync(temporaryDirectory, { recursive: true, force: true });
    });
    await new Promise((resolve) => server.once("listening", resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    async function call(route, { method = "GET", body } = {}) {
        const response = await fetch(`${baseUrl}${route}`, {
            method,
            headers: body ? { "Content-Type": "application/json" } : {},
            body: body ? JSON.stringify(body) : undefined,
        });
        return { status: response.status, data: await response.json() };
    }

    for (const page of ["/login.html", "/register.html"]) {
        const response = await fetch(`${baseUrl}${page}`);
        assert.equal(response.status, 200);
        assert.match(await response.text(), /button[^>]+disabled/);
    }

    const profile = {
        name: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        username: "ada.l",
        password: "unique-pass-123",
    };
    const registered = await call("/register", { method: "POST", body: profile });
    assert.equal(registered.status, 201);
    assert.equal(registered.data.message, "User registered successfully.");
    assert.equal("passwordHash" in registered.data.user, false);
    const userId = registered.data.user.id;

    const storedUsers = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    assert.match(storedUsers[0].passwordHash, /^\$2[aby]\$/);
    assert.equal(await bcrypt.compare(profile.password, storedUsers[0].passwordHash), true);

    const duplicateUsername = await call("/register", { method: "POST", body: { ...profile, email: "other@example.com" } });
    assert.equal(duplicateUsername.status, 409);
    const duplicatePassword = await call("/register", { method: "POST", body: { ...profile, email: "other@example.com", username: "other-user" } });
    assert.equal(duplicatePassword.status, 409);
    assert.equal(JSON.parse(fs.readFileSync(usersFile, "utf8")).length, 1);

    const login = await call("/login", { method: "POST", body: { username: profile.username, password: profile.password } });
    assert.equal(login.status, 200);
    assert.equal(login.data.user.id, userId);
    assert.equal((await call("/login", { method: "POST", body: { username: profile.username, password: "wrong-password" } })).status, 401);

    const list = await call("/users");
    assert.equal(list.status, 200);
    assert.equal(list.data.users.length, 1);
    assert.equal("passwordHash" in list.data.users[0], false);
    assert.equal((await call(`/users/${userId}`)).data.user.username, profile.username);
    assert.equal((await call("/users/not-a-user")).status, 404);

    const updated = await call(`/users/${userId}`, { method: "PUT", body: { name: "Augusta", username: "augusta", password: "another-pass-123" } });
    assert.equal(updated.status, 200);
    assert.equal(updated.data.user.name, "Augusta");
    assert.equal((await call("/login", { method: "POST", body: { username: "augusta", password: "another-pass-123" } })).status, 200);

    fs.writeFileSync(usersFile, "not valid json");
    const originalError = console.error;
    console.error = () => {};
    try {
        assert.equal((await call("/users")).status, 500);
    } finally {
        console.error = originalError;
    }
});
