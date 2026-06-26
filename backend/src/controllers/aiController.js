const aiService = require('../services/aiService');
const { clampText, parsePositiveInt } = require('../utils/validation');

const sendError = (res, status, message) => res.status(status).json({
    success: false,
    error: { message }
});

/* Retorna recomendacoes de livros similares. */
const getRecommendations = async (req, res) => {
    try {
        const bookTitle = clampText(req.params.bookTitle, 120);

        if (bookTitle.length < 2) {
            return sendError(res, 400, 'Informe um título com pelo menos 2 caracteres.');
        }

        const recommendations = await aiService.getRecommendations(bookTitle);
        res.status(200).json(recommendations);
    } catch (error) {
        console.error('Erro ao gerar recomendações:', error);
        sendError(res, 500, 'Não foi possível gerar recomendações.');
    }
};

/* Retorna resumo gerado a partir das reviews do livro. */
const getReviewSummary = async (req, res) => {
    try {
        const bookId = parsePositiveInt(req.params.bookId, 'bookId');

        const summary = await aiService.generateReviewSummary(bookId);
        res.status(200).json(summary);
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'No momento não foi possível gerar um resumo das avaliações.');
    }
};

/* Executa busca textual ou semantica no catalogo. */
const semanticSearchBooks = async (req, res) => {
    try {
        const searchQuery = clampText(req.body.query, 160);

        if (searchQuery.length < 2) {
            return sendError(res, 400, 'O campo query é obrigatório.');
        }

        const response = await aiService.semanticSearchBooks(searchQuery);

        return res.status(200).json(response);

    } catch (error) {
        console.error('Erro na busca semântica:', error);

        return sendError(res, 500, 'Não foi possível realizar a busca.');
    }
};

module.exports = {
    getRecommendations,
    getReviewSummary,
    semanticSearchBooks
};