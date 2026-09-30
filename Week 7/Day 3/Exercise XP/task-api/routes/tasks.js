const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "..", "tasks.json");

/* ---------- File helpers ---------- */

// Read all tasks. Creates the file with [] if it doesn't exist.
async function readTasks() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const data = JSON.parse(raw || "[]");
    if (!Array.isArray(data)) throw new Error("tasks.json must contain an array");
    return data;
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(DATA_FILE, "[]");
      return [];
    }
    err.status = 500;
    err.publicMessage = "Failed to read tasks data";
    throw err;
  }
}

// Write tasks to a temp file, then rename (avoids a half-written tasks.json)
async function writeTasks(tasks) {
  try {
    const tmp = DATA_FILE + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(tasks, null, 2));
    await fs.rename(tmp, DATA_FILE);
  } catch (err) {
    err.status = 500;
    err.publicMessage = "Failed to save tasks data";
    throw err;
  }
}

// Simple queue so overlapping requests don't overwrite each other's changes
let queue = Promise.resolve();
function withLock(fn) {
  const run = queue.then(fn);
  queue = run.catch(() => {}); // keep the queue alive after failures
  return run;
}

/* ---------- Validation ---------- */

// Returns an array of error messages (empty = valid).
// requireTitle: true for POST, false for PUT (partial updates allowed).
function validateTask(body, { requireTitle }) {
  const errors = [];
  const { title, description, completed } = body || {};

  if (requireTitle && title === undefined) {
    errors.push("title is required");
  }
  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    errors.push("title must be a non-empty string");
  }
  if (description !== undefined && typeof description !== "string") {
    errors.push("description must be a string");
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push("completed must be a boolean");
  }
  if (!requireTitle && title === undefined && description === undefined && completed === undefined) {
    errors.push("provide at least one of: title, description, completed");
  }
  return errors;
}

// Validate :id param
function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "id must be a positive integer" });
    return null;
  }
  return id;
}

/* ---------- Routes ---------- */

// GET /tasks — all tasks
router.get("/", async (req, res, next) => {
  try {
    res.json(await readTasks());
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id — one task
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const tasks = await readTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) return res.status(404).json({ error: `Task ${id} not found` });

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// POST /tasks — create
router.post("/", async (req, res, next) => {
  try {
    const errors = validateTask(req.body, { requireTitle: true });
    if (errors.length) return res.status(400).json({ errors });

    const newTask = await withLock(async () => {
      const tasks = await readTasks();
      const nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
      const task = {
        id: nextId,
        title: req.body.title.trim(),
        description: req.body.description ?? "",
        completed: req.body.completed ?? false,
        createdAt: new Date().toISOString(),
      };
      tasks.push(task);
      await writeTasks(tasks);
      return task;
    });

    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id — update
router.put("/:id", async (req, res, next) => {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const errors = validateTask(req.body, { requireTitle: false });
    if (errors.length) return res.status(400).json({ errors });

    const updated = await withLock(async () => {
      const tasks = await readTasks();
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return null;

      const { title, description, completed } = req.body;
      if (title !== undefined) tasks[index].title = title.trim();
      if (description !== undefined) tasks[index].description = description;
      if (completed !== undefined) tasks[index].completed = completed;
      tasks[index].updatedAt = new Date().toISOString();

      await writeTasks(tasks);
      return tasks[index];
    });

    if (!updated) return res.status(404).json({ error: `Task ${id} not found` });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id — remove
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const removed = await withLock(async () => {
      const tasks = await readTasks();
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return null;

      const [task] = tasks.splice(index, 1);
      await writeTasks(tasks);
      return task;
    });

    if (!removed) return res.status(404).json({ error: `Task ${id} not found` });
    res.json({ message: "Task deleted", task: removed });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
