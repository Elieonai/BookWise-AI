const request = require('supertest');

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
const { resetAiRateLimiter } = require('../src/middlewares/aiRateLimiter');
const app = require('../src/app');
const { aiRateLimiter } = require('../src/middlewares/aiRateLimiter');

describe('app routes', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        resetAiRateLimiter();
    });

    test('serves Swagger JSON and UI', async () => {
        const jsonResponse = await request(app).get('/api-docs.json');
        const htmlResponse = await request(app).get('/api-docs/');

        expect(jsonResponse.status).toBe(200);
        expect(jsonResponse.body.openapi).toBe('3.0.0');
        expect(jsonResponse.body.paths['/ai/semantic-search']).toBeDefined();
        expect(htmlResponse.status).toBe(200);
        expect(htmlResponse.text).toContain('Swagger UI');
    });

    test('handles book routes', async () => {
        bookService.getTopRatedBooks.mockResolvedValueOnce([{ id: 1 }]);
        bookService.getAllBooks.mockResolvedValueOnce([{ id: 2 }]);
        bookService.getBookById.mockResolvedValueOnce({ id: 3 });

        await expect(request(app).get('/api/books/top-rated?limit=1')).resolves.toMatchObject({
            status: 200,
            body: [{ id: 1 }]
        });
        await expect(request(app).get('/api/books')).resolves.toMatchObject({
            status: 200,
            body: [{ id: 2 }]
        });
        await expect(request(app).get('/api/books/3')).resolves.toMatchObject({
            status: 200,
            body: { id: 3 }
        });
    });

    test('handles review routes', async () => {
        reviewService.getAllReviews
            .mockResolvedValueOnce([{ id: 'r1' }])
            .mockResolvedValueOnce([{ id: 'r2' }]);
        reviewService.addReview.mockResolvedValueOnce({ id: 'created' });

        await expect(request(app).get('/api/reviews')).resolves.toMatchObject({
            status: 200,
            body: [{ id: 'r1' }]
        });
        await expect(request(app).get('/api/reviews/1')).resolves.toMatchObject({
            status: 200,
            body: [{ id: 'r2' }]
        });
        await expect(request(app).post('/api/reviews').send({ bookId: 1, nome: 'Ana', nota: 5 })).resolves.toMatchObject({
            status: 201,
            body: { id: 'created' }
        });
    });

    test('handles AI routes', async () => {
        aiService.getRecommendations.mockResolvedValueOnce([{ livro: 'Livro' }]);
        aiService.generateReviewSummary.mockResolvedValueOnce({ summary: 'Resumo' });
        aiService.semanticSearchBooks.mockResolvedValueOnce({ type: 'direct', results: [] });

        await expect(request(app).get('/api/ai/recommendations/Dom%20Casmurro')).resolves.toMatchObject({
            status: 200,
            body: [{ livro: 'Livro' }]
        });
        await expect(request(app).get('/api/ai/reviews-summary/1')).resolves.toMatchObject({
            status: 200,
            body: { summary: 'Resumo' }
        });
        await expect(request(app).post('/api/ai/semantic-search').send({ query: 'fantasia' })).resolves.toMatchObject({
            status: 200,
            body: { type: 'direct', results: [] }
        });
    });

    test('rate limits AI routes after too many requests from the same client', async () => {
        aiService.semanticSearchBooks.mockResolvedValue({ type: 'direct', results: [] });

        for (let index = 0; index < 30; index += 1) {
            await request(app)
                .post('/api/ai/semantic-search')
                .send({ query: `fantasia ${index}` })
                .expect(200);
        }

        await request(app)
            .post('/api/ai/semantic-search')
            .send({ query: 'fantasia limite' })
            .expect(429)
            .expect(({ body }) => {
                expect(body).toEqual({
                    success: false,
                    error: { message: 'Muitas requisições. Tente novamente em instantes.' }
                });
            });
    });

    test('corsOrigin accepts origins when allow list is empty', () => {
        const callback = jest.fn();

        app.corsOrigin('https://example.com', callback);

        expect(callback).toHaveBeenCalledWith(null, true);
    });

    test('createCorsOrigin rejects origins outside an explicit allow list', () => {
        const callback = jest.fn();
        const corsOrigin = app.createCorsOrigin(['https://bookwise-ai.vercel.app']);

        corsOrigin('https://example.com', callback);

        expect(callback).toHaveBeenCalledWith(expect.any(Error));
    });

    test('aiRateLimiter falls back to unknown ip when request has no address', () => {
        const req = { socket: {} };
        const res = { status: jest.fn(() => res), json: jest.fn(() => res) };
        const next = jest.fn();

        aiRateLimiter(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
