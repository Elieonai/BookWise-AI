jest.mock('../src/services/bookService', () => ({
    getAllBooks: jest.fn(),
    getBookById: jest.fn(),
    getTopRatedBooks: jest.fn()
}));

jest.mock('../src/services/reviewService', () => ({
    getAllReviews: jest.fn(),
    addReview: jest.fn()
}));

jest.mock('../src/services/aiService', () => ({
    getRecommendations: jest.fn(),
    generateReviewSummary: jest.fn(),
    semanticSearchBooks: jest.fn()
}));

const bookService = require('../src/services/bookService');
const reviewService = require('../src/services/reviewService');
const aiService = require('../src/services/aiService');
const bookController = require('../src/controllers/bookController');
const reviewController = require('../src/controllers/reviewController');
const aiController = require('../src/controllers/aiController');

const createRes = () => {
    const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res)
    };

    return res;
};

const errorResponse = (message) => ({
    success: false,
    error: { message }
});

describe('controllers', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    test('bookController.getAllBooks returns books', async () => {
        const res = createRes();
        bookService.getAllBooks.mockResolvedValueOnce([{ id: 1 }]);

        await bookController.getAllBooks({}, res);

        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    test('bookController.getAllBooks returns 500 on failure', async () => {
        const res = createRes();
        bookService.getAllBooks.mockRejectedValueOnce(new Error('fail'));

        await bookController.getAllBooks({}, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(errorResponse('Não foi possível listar os livros.'));
    });

    test('bookController.getBookById returns a book', async () => {
        const res = createRes();
        bookService.getBookById.mockResolvedValueOnce({ id: 1 });

        await bookController.getBookById({ params: { id: '1' } }, res);

        expect(bookService.getBookById).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    test('bookController.getBookById returns 404 on failure', async () => {
        const res = createRes();
        bookService.getBookById.mockRejectedValueOnce(new Error('not found'));

        await bookController.getBookById({ params: { id: '99' } }, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(errorResponse('Livro não encontrado.'));
    });

    test('bookController.getBookById validates invalid id', async () => {
        const res = createRes();

        await bookController.getBookById({ params: { id: 'abc' } }, res);

        expect(bookService.getBookById).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(errorResponse('Livro não encontrado.'));
    });

    test('bookController.getTopRatedBooks returns rated books', async () => {
        const res = createRes();
        bookService.getTopRatedBooks.mockResolvedValueOnce([{ id: 1 }]);

        await bookController.getTopRatedBooks({ query: { limit: '3' } }, res);

        expect(bookService.getTopRatedBooks).toHaveBeenCalledWith(3);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    test('bookController.getTopRatedBooks uses default limit and handles failure', async () => {
        const res = createRes();
        bookService.getTopRatedBooks.mockRejectedValueOnce(new Error('fail'));

        await bookController.getTopRatedBooks({ query: {} }, res);

        expect(bookService.getTopRatedBooks).toHaveBeenCalledWith(6);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(errorResponse('Não foi possível listar os livros mais avaliados.'));
    });

    test('bookController.getTopRatedBooks validates invalid limit', async () => {
        const res = createRes();

        await bookController.getTopRatedBooks({ query: { limit: '-1' } }, res);

        expect(bookService.getTopRatedBooks).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(errorResponse('Não foi possível listar os livros mais avaliados.'));
    });

    test('reviewController.getAllReviews returns reviews', async () => {
        const res = createRes();
        reviewService.getAllReviews.mockResolvedValueOnce([{ id: 'r1' }]);

        await reviewController.getAllReviews({ params: { bookId: '1' } }, res);

        expect(reviewService.getAllReviews).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith([{ id: 'r1' }]);
    });

    test('reviewController.getAllReviews returns 500 on failure', async () => {
        const res = createRes();
        reviewService.getAllReviews.mockRejectedValueOnce(new Error('fail'));

        await reviewController.getAllReviews({ params: {} }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(errorResponse('Não foi possível listar as resenhas.'));
    });

    test('reviewController.getAllReviews validates invalid bookId', async () => {
        const res = createRes();

        await reviewController.getAllReviews({ params: { bookId: 'abc' } }, res);

        expect(reviewService.getAllReviews).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(errorResponse('Não foi possível listar as resenhas.'));
    });

    test('reviewController.addReview creates a review', async () => {
        const res = createRes();
        const body = { bookId: 1, nome: 'Ana', nota: 5 };
        reviewService.addReview.mockResolvedValueOnce({ id: 'r1' });

        await reviewController.addReview({ body }, res);

        expect(reviewService.addReview).toHaveBeenCalledWith(body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 'r1' });
    });

    test('reviewController.addReview returns 400 on validation failure', async () => {
        const res = createRes();
        reviewService.addReview.mockRejectedValueOnce(new Error('invalid'));

        await reviewController.addReview({ body: {} }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(errorResponse('invalid'));
    });

    test('aiController.getRecommendations returns recommendations', async () => {
        const res = createRes();
        aiService.getRecommendations.mockResolvedValueOnce([{ livro: 'Livro' }]);

        await aiController.getRecommendations({ params: { bookTitle: 'Dom' } }, res);

        expect(aiService.getRecommendations).toHaveBeenCalledWith('Dom');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ livro: 'Livro' }]);
    });

    test('aiController.getRecommendations returns 500 on failure', async () => {
        const res = createRes();
        aiService.getRecommendations.mockRejectedValueOnce(new Error('fail'));

        await aiController.getRecommendations({ params: { bookTitle: 'Dom' } }, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(errorResponse('Não foi possível gerar recomendações.'));
    });

    test('aiController.getRecommendations validates short title', async () => {
        const res = createRes();

        await aiController.getRecommendations({ params: { bookTitle: 'a' } }, res);

        expect(aiService.getRecommendations).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(errorResponse('Informe um título com pelo menos 2 caracteres.'));
    });

    test('aiController.getReviewSummary returns a summary', async () => {
        const res = createRes();
        aiService.generateReviewSummary.mockResolvedValueOnce({ summary: 'Resumo' });

        await aiController.getReviewSummary({ params: { bookId: '1' } }, res);

        expect(aiService.generateReviewSummary).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ summary: 'Resumo' });
    });

    test('aiController.getReviewSummary validates invalid id', async () => {
        const res = createRes();

        await aiController.getReviewSummary({ params: { bookId: 'abc' } }, res);

        expect(aiService.generateReviewSummary).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(errorResponse('No momento não foi possível gerar um resumo das avaliações.'));
    });

    test('aiController.getReviewSummary returns safe summary on failure', async () => {
        const res = createRes();
        aiService.generateReviewSummary.mockRejectedValueOnce(new Error('fail'));

        await aiController.getReviewSummary({ params: { bookId: '1' } }, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(errorResponse('No momento não foi possível gerar um resumo das avaliações.'));
    });

    test('aiController.semanticSearchBooks validates query', async () => {
        const res = createRes();

        await aiController.semanticSearchBooks({ body: { query: 'a' } }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(errorResponse('O campo query é obrigatório.'));
    });

    test('aiController.semanticSearchBooks returns search results', async () => {
        const res = createRes();
        aiService.semanticSearchBooks.mockResolvedValueOnce({ type: 'direct', results: [] });

        await aiController.semanticSearchBooks({ body: { query: 'fantasia' } }, res);

        expect(aiService.semanticSearchBooks).toHaveBeenCalledWith('fantasia');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ type: 'direct', results: [] });
    });

    test('aiController.semanticSearchBooks returns 500 on failure', async () => {
        const res = createRes();
        aiService.semanticSearchBooks.mockRejectedValueOnce(new Error('fail'));

        await aiController.semanticSearchBooks({ body: { query: 'fantasia' } }, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(errorResponse('Não foi possível realizar a busca.'));
    });
});
