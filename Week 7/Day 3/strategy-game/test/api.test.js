const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../server");

test("REST API registers players, starts a game, and enforces turns", async (context) => {
    const server = app.listen(0);
    context.after(() => new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    }));
    await new Promise((resolve) => server.once("listening", resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    async function call(path, { token, method = "GET", body } = {}) {
        const response = await fetch(`${baseUrl}${path}`, {
            method,
            headers: {
                ...(body ? { "Content-Type": "application/json" } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        return { status: response.status, data: await response.json() };
    }

    const suffix = Date.now().toString(36);
    const firstName = `north${suffix}`;
    const secondName = `south${suffix}`;
    assert.equal((await call("/api/register", { method: "POST", body: { username: firstName, password: "test-password-1" } })).status, 201);
    assert.equal((await call("/api/register", { method: "POST", body: { username: secondName, password: "test-password-2" } })).status, 201);

    const firstLogin = await call("/api/login", { method: "POST", body: { username: firstName, password: "test-password-1" } });
    const secondLogin = await call("/api/login", { method: "POST", body: { username: secondName, password: "test-password-2" } });
    assert.equal(firstLogin.status, 200);
    assert.equal(secondLogin.status, 200);

    const created = await call("/api/games", { token: firstLogin.data.token, method: "POST" });
    assert.equal(created.status, 201);
    const gameId = created.data.game.id;
    const joined = await call(`/api/games/${gameId}/join`, { token: secondLogin.data.token, method: "POST" });
    assert.equal(joined.status, 200);
    assert.equal(joined.data.game.status, "active");

    const wrongTurn = await call(`/api/games/${gameId}/move`, { token: secondLogin.data.token, method: "POST", body: { direction: "up" } });
    assert.equal(wrongTurn.status, 400);
    assert.match(wrongTurn.data.error, /not your turn/i);

    const legal = await call(`/api/games/${gameId}/valid-moves`, { token: firstLogin.data.token });
    assert.equal(legal.status, 200);
    assert.equal(legal.data.moves.length, 2);
    const moved = await call(`/api/games/${gameId}/move`, { token: firstLogin.data.token, method: "POST", body: { direction: "right" } });
    assert.equal(moved.status, 200);
    assert.equal(moved.data.game.currentTurn, joined.data.game.players[1].id);

    const winner = await call(`/api/games/${gameId}/winner`, { token: firstLogin.data.token });
    assert.equal(winner.status, 200);
    assert.equal(winner.data.winner, null);
});
