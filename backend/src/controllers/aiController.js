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

module.exports = {
    getRecommendations,
    getReviewSummary
};