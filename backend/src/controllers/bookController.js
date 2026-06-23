const bookService = require('../services/bookService');

const getAllBooks = (req, res) => {
    try {
        const books = bookService.getAllBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBookById = (req, res) => {
    const { id } = req.params;

    try {
        const book = bookService.getBookById(id);
        res.json(book);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById
};