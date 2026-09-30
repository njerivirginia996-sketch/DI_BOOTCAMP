const bookModel = require("../models/bookModel");

// GET all books
const getBooks = async (req, res) => {
    try {
        const books = await bookModel.getAllBooks();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get books"
        });
    }
};

// GET one book by ID
const getBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const book = await bookModel.getBookById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get book"
        });
    }
};

// POST - create a new book
const createBook = async (req, res) => {
    try {
        const { title, author, publishedYear } = req.body;

        if (!title || !author || !publishedYear) {
            return res.status(400).json({
                message: "Title, author and publishedYear are required"
            });
        }

        const [newBook] = await bookModel.createBook({
            title,
            author,
            publishedYear
        });

        res.status(201).json(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create book"
        });
    }
};

// PUT - update a book
const updateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { title, author, publishedYear } = req.body;

        const [updatedBook] = await bookModel.updateBook(bookId, {
            title,
            author,
            publishedYear
        });

        if (!updatedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update book"
        });
    }
};

// DELETE - delete a book
const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const deleted = await bookModel.deleteBook(bookId);

        if (deleted === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json({
            message: "Book deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete book"
        });
    }
};

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
};