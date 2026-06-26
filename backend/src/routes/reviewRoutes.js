const router = require('express').Router();
const controller = require('../controllers/reviewController');

/* Rota legado para listar todas as reviews. */
router.get('/reviews', controller.getAllReviews);
/* Rota legado para listar reviews de um livro. */
router.get('/reviews/:bookId', controller.getAllReviews);
/* Rota legado para criar review via API. */
router.post('/reviews', controller.addReview);

module.exports = router;