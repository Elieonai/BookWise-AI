const router = require('express').Router();
const controller = require('../controllers/aiController');

/* Rota Render para recomendacoes Gemini. */
router.get('/recommendations/:bookTitle', controller.getRecommendations);
/* Rota Render para resumo das reviews. */
router.get('/reviews-summary/:bookId', controller.getReviewSummary);
/* Rota Render para busca semantica no catalogo. */
router.post('/semantic-search', controller.semanticSearchBooks);

module.exports = router;