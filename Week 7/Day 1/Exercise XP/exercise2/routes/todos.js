const express = require("express");

const router = express.Router();

// In-memory database
const todos = [];

// GET - Get all todos
router.get("/", (req, res) => {
    res.json(todos);
});

// POST - Add a new todo
router.post("/", (req, res) => {
    const { title } = req.body;

    const newTodo = {
        id: todos.length + 1,
        title: title,
        completed: false
    };

    todos.push(newTodo);

    res.status(201).json(newTodo);
});

// PUT - Update a todo
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const todo = todos.find(todo => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    const { title, completed } = req.body;

    if (title !== undefined) {
        todo.title = title;
    }

    if (completed !== undefined) {
        todo.completed = completed;
    }

    res.json(todo);
});

// DELETE - Delete a todo
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    const deletedTodo = todos.splice(index, 1);

    res.json({
        message: "Todo deleted successfully",
        todo: deletedTodo[0]
    });
});

module.exports = router;