const router = require('express').Router();
const controller = require('../controllers/aiController');

router.get('/recommendations/:bookTitle', controller.getRecommendations);
router.get("/reviews-summary/:bookId", controller.getReviewSummary);

module.exports = router;
