const express = require("express");

const router = express.Router();

const {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

// GET all books
router.get("/books", getBooks);

// GET one book
router.get("/books/:bookId", getBook);

// POST a new book
router.post("/books", createBook);

// PUT/update a book
router.put("/books/:bookId", updateBook);

// DELETE a book
router.delete("/books/:bookId", deleteBook);

module.exports = router;

