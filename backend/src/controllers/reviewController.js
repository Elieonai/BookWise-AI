const reviewsService = require('../services/reviewService');

const getAllReviews = async (req, res) => {
    const { bookId } = req.params;

    try {
        const reviews = await reviewsService.getAllReviews(bookId);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addReview = async (req, res) => {
    const reviewData = req.body;

    try {
        const newReview = await reviewsService.addReview(reviewData);
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllReviews,
    addReview
};      