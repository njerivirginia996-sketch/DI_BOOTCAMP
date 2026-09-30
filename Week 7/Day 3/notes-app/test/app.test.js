const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const appPath = path.join(__dirname, "..", "app.js");

test("CLI adds, lists, reads, and removes notes from JSON storage", (context) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "notes-app-"));
    const notesFile = path.join(directory, "notes.json");
    context.after(() => fs.rmSync(directory, { recursive: true, force: true }));

    function run(...args) {
        return spawnSync(process.execPath, [appPath, ...args], {
            encoding: "utf8",
            env: { ...process.env, NOTES_FILE: notesFile },
        });
    }

    assert.match(run("add", "--title=Project", "--body=Remember the details").stdout, /New note added!/);
    assert.match(run("add", "--title=Project", "--body=Duplicate").stdout, /Note already exists/);
    assert.match(run("list").stdout, /- Project/);
    assert.match(run("read", "--title=Project").stdout, /Body: Remember the details/);
    assert.match(run("read", "--title=Missing").stdout, /Note not found/);
    assert.match(run("remove", "--title=Project").stdout, /Note removed/);
    assert.match(run("remove", "--title=Project").stdout, /Note not found/);
    assert.deepEqual(JSON.parse(fs.readFileSync(notesFile, "utf8")), []);
    assert.match(run("unknown-command").stderr, /command not recognized/i);
});
