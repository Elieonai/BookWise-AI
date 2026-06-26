const bookService = require('../services/bookService');
const { parsePositiveInt } = require('../utils/validation');

const sendError = (res, status, message) => res.status(status).json({
    success: false,
    error: { message }
});

/* Retorna todos os livros cadastrados no Firestore. */
const getAllBooks = async (req, res) => {
    try {
        const books = await bookService.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        console.error('Erro ao listar livros:', error);
        sendError(res, 500, 'Não foi possível listar os livros.');
    }
};

/* Retorna um livro pelo id numerico informado na rota. */
const getBookById = async (req, res) => {
    const { id } = req.params;

    try {
        const bookId = parsePositiveInt(id, 'id');
        const book = await bookService.getBookById(bookId);
        res.status(200).json(book);
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
        sendError(res, 404, 'Livro não encontrado.');
    }
};

/* Retorna os livros com melhor media baseada nas reviews. */
const getTopRatedBooks = async (req, res) => {
    try {
        const limit = req.query.limit ? parsePositiveInt(req.query.limit, 'limit') : 6;

        const books = await bookService.getTopRatedBooks(limit);

        res.status(200).json(books);
    } catch (error) {
        console.error('Erro ao listar livros mais avaliados:', error);
        sendError(res, 400, 'Não foi possível listar os livros mais avaliados.');
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    getTopRatedBooks
};