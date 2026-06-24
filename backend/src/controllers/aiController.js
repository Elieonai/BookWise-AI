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

module.exports = {
    getRecommendations
};