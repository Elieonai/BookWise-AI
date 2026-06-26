const reviewsService = require('../services/reviewService');
const { parsePositiveInt } = require('../utils/validation');

const sendError = (res, status, message) => res.status(status).json({
    success: false,
    error: { message }
});

/* Lista reviews gerais ou filtradas por bookId. */
const getAllReviews = async (req, res) => {
    const { bookId } = req.params;

    try {
        const parsedBookId = bookId ? parsePositiveInt(bookId, 'bookId') : undefined;
        const reviews = await reviewsService.getAllReviews(parsedBookId);
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Erro ao listar resenhas:', error);
        sendError(res, 400, 'Não foi possível listar as resenhas.');
    }
};

/* Cria uma review usando validacao do service. */
const addReview = async (req, res) => {
    const reviewData = req.body;

    try {
        const newReview = await reviewsService.addReview(reviewData);
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Erro ao criar resenha:', error);
        sendError(res, 400, error.message);
    }
};

module.exports = {
    getAllReviews,
    addReview
};