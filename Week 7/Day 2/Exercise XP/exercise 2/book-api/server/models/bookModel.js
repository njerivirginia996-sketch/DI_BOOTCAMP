const db = require("../config/db");

const getAllBooks = () => {
    return db("books").select("*");
};

const getBookById = (id) => {
    return db("books").where({ id }).first();
};

const createBook = (book) => {
    return db("books").insert(book).returning("*");
};

const updateBook = (id, book) => {
    return db("books").where({ id }).update(book).returning("*");
};

const deleteBook = (id) => {
    return db("books").where({ id }).del();
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};