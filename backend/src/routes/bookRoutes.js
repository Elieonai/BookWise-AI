const router = require('express').Router();
const controller = require('../controllers/bookController');

/* Rota legado para ranking de livros por reviews. */
router.get('/books/top-rated', controller.getTopRatedBooks);
/* Rota legado para listar livros do Firestore. */
router.get('/books', controller.getAllBooks);
/* Rota legado para buscar livro por id. */
router.get('/books/:id', controller.getBookById);

module.exports = router;