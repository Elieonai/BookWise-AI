const router = require('express').Router();
const controller = require('../controllers/bookController');

router.get('/books', controller.getAllBooks);
router.get('/books/:id', controller.getBookById);

module.exports = router;