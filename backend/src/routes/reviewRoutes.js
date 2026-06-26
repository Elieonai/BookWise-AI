const router = require('express').Router();
const controller = require('../controllers/reviewController');

router.get('/reviews', controller.getAllReviews);
router.get('/reviews/:bookId', controller.getAllReviews);
router.post('/reviews', controller.addReview);

module.exports = router;