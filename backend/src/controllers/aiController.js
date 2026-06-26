const aiService = require('../services/aiService');

const getRecommendations = async (req, res) => {
    try {
        const { bookTitle } = req.params;

        const recommendations = await aiService.getRecommendations(bookTitle);
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReviewSummary = async (req, res) => {
    try {
        const { bookId } = req.params;

        const summary = await aiService.generateReviewSummary(bookId);
        res.status(200).json(summary);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            summary: "No momento não foi possível gerar um resumo das avaliações."
        });
    }
};

const semanticSearchBooks = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                type: "empty",
                results: [],
                message: "O campo query é obrigatório."
            });
        }

        const response = await aiService.semanticSearchBooks(query);

        return res.status(200).json(response);

    } catch (error) {
        console.error("Erro na busca semântica:", error);

        return res.status(500).json({
            type: "error",
            results: [],
            message: "Não foi possível realizar a busca."
        });
    }
};

module.exports = {
    getRecommendations,
    getReviewSummary,
    semanticSearchBooks
};