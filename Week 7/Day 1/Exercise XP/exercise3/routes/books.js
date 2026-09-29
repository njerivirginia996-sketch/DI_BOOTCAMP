const express = require("express");

const router = express.Router();

// In-memory database
const books = [];

// GET - Get all books
router.get("/", (req, res) => {
    res.json(books);
});

// POST - Add a new book
router.post("/", (req, res) => {
    const { title, author } = req.body;

    const newBook = {
        id: books.length + 1,
        title: title,
        author: author
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// PUT - Update a book
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author } = req.body;

    if (title !== undefined) {
        book.title = title;
    }

    if (author !== undefined) {
        book.author = author;
    }

    res.json(book);
});

// DELETE - Delete a book
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1);

    res.json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});

module.exports = router;