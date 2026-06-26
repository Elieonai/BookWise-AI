const bookService = require('../services/bookService');

const getAllBooks = async (req, res) => {
    try {
        const books = await bookService.getAllBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBookById = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await bookService.getBookById(id);
        res.json(book);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById
};