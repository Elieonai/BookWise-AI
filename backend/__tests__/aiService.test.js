const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn(() => ({ generateContent: mockGenerateContent }));

jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: mockGetGenerativeModel
    }))
}));

jest.mock('../src/config/firebase', () => ({ db: { app: 'mock-db' } }));

const mockCollection = jest.fn((db, name) => ({ name }));
const mockGetDocs = jest.fn();

jest.mock('firebase/firestore', () => ({
    collection: mockCollection,
    getDocs: mockGetDocs
}));

const mockBookService = {
    getAllBooks: jest.fn(),
    getBookById: jest.fn()
};
const mockReviewService = {
    getAllReviews: jest.fn()
};

jest.mock('../src/services/bookService', () => mockBookService);
jest.mock('../src/services/reviewService', () => mockReviewService);

const aiService = require('../src/services/aiService');

const createDoc = (data) => ({ data: () => data });
const geminiResponse = (text) => ({ response: { text: () => text } });

const books = [
    { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', genero: 'Romance', descricao: 'Clássico brasileiro', avaliacao: 4.8 },
    { id: 2, titulo: 'O Hobbit', autor: 'J. R. R. Tolkien', genero: 'Fantasia', descricao: 'Aventura fantastica', avaliacao: 4.9 },
    { id: 3, titulo: '1984', autor: 'George Orwell', genero: 'Distopia', descricao: 'Controle social', avaliacao: 4.7 }
];

describe('aiService', () => {
    beforeEach(() => {
        mockGenerateContent.mockReset();
        mockGetDocs.mockReset();
        mockBookService.getAllBooks.mockReset();
        mockBookService.getBookById.mockReset();
        mockReviewService.getAllReviews.mockReset();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    test('getRecommendations returns parsed Gemini JSON', async () => {
        mockGenerateContent.mockResolvedValueOnce(geminiResponse('```json\n[{"livro":"Livro IA","autor":"Autor","sinopse":"Texto"}]\n```'));

        await expect(aiService.getRecommendations('Dom Casmurro')).resolves.toEqual([
            { livro: 'Livro IA', autor: 'Autor', sinopse: 'Texto' }
        ]);
        expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-2.5-flash' });
    });

    test('getRecommendations falls back to top rated books when Gemini fails', async () => {
        mockGenerateContent.mockRejectedValueOnce(new Error('gemini down'));
        mockGetDocs.mockResolvedValueOnce({
            docs: [
                createDoc({ bookId: 1, nota: 5 }),
                createDoc({ bookId: 1, nota: 4 }),
                createDoc({ bookId: 2, nota: 3 })
            ]
        });
        mockBookService.getAllBooks.mockResolvedValueOnce(books);

        await expect(aiService.getRecommendations('Dom Casmurro')).resolves.toEqual([
            { livro: 'Dom Casmurro', autor: 'Machado de Assis', sinopse: 'Clássico brasileiro' },
            { livro: 'O Hobbit', autor: 'J. R. R. Tolkien', sinopse: 'Aventura fantastica' }
        ]);
    });

    test('getRecommendations handles ranked reviews without matching catalog book', async () => {
        mockGenerateContent.mockRejectedValueOnce(new Error('gemini down'));
        mockGetDocs.mockResolvedValueOnce({
            docs: [createDoc({ bookId: 99, nota: 5 })]
        });
        mockBookService.getAllBooks.mockResolvedValueOnce(books);

        await expect(aiService.getRecommendations('Livro perdido')).resolves.toEqual([
            { livro: undefined, autor: undefined, sinopse: undefined }
        ]);
    });

    test('getRecommendations falls back to random catalog when there are no reviews', async () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.7);
        mockGenerateContent.mockRejectedValueOnce(new Error('gemini down'));
        mockGetDocs.mockResolvedValueOnce({ docs: [] });
        mockBookService.getAllBooks.mockResolvedValueOnce(books);

        await expect(aiService.getRecommendations('Dom Casmurro')).resolves.toHaveLength(3);
        randomSpy.mockRestore();
    });

    test('generateReviewSummary returns not found when the book does not exist', async () => {
        mockBookService.getBookById.mockRejectedValueOnce(new Error('not found'));

        await expect(aiService.generateReviewSummary(99)).resolves.toEqual({
            summary: 'Livro não encontrado.'
        });
    });

    test('generateReviewSummary requires at least two reviews', async () => {
        mockBookService.getBookById.mockResolvedValueOnce(books[0]);
        mockReviewService.getAllReviews.mockResolvedValueOnce([{ nota: 5, comentario: 'Bom' }]);

        await expect(aiService.generateReviewSummary(1)).resolves.toEqual({
            summary: 'Ainda não há avaliações suficientes para gerar um resumo.'
        });
    });

    test('generateReviewSummary returns parsed Gemini summary', async () => {
        mockBookService.getBookById.mockResolvedValueOnce(books[0]);
        mockReviewService.getAllReviews.mockResolvedValueOnce([
            { nota: 5, comentario: 'Excelente' },
            { nota: 4, comentario: 'Reflexivo' }
        ]);
        mockGenerateContent.mockResolvedValueOnce(geminiResponse('```json\n{"summary":"Resumo gerado."}\n```'));

        await expect(aiService.generateReviewSummary(1)).resolves.toEqual({ summary: 'Resumo gerado.' });
    });

    test('generateReviewSummary returns safe summary when Gemini fails', async () => {
        mockBookService.getBookById.mockResolvedValueOnce(books[0]);
        mockReviewService.getAllReviews.mockResolvedValueOnce([
            { nota: 5, comentario: 'Excelente' },
            { nota: 4, comentario: 'Reflexivo' }
        ]);
        mockGenerateContent.mockRejectedValueOnce(new Error('gemini down'));

        await expect(aiService.generateReviewSummary(1)).resolves.toEqual({
            summary: 'No momento não foi possível gerar um resumo automático das avaliações.'
        });
    });

    test('semanticSearchBooks returns empty response for short query', async () => {
        mockBookService.getAllBooks.mockResolvedValueOnce(books);

        await expect(aiService.semanticSearchBooks('a')).resolves.toEqual({
            type: 'empty',
            results: [],
            message: 'Digite pelo menos 2 caracteres para buscar.'
        });
    });

    test('semanticSearchBooks returns direct matches ignoring accents', async () => {
        mockBookService.getAllBooks.mockResolvedValueOnce(books);

        await expect(aiService.semanticSearchBooks('classico')).resolves.toEqual({
            type: 'direct',
            results: [
                {
                    ...books[0],
                    motivo: 'Encontrado diretamente no catálogo.'
                }
            ]
        });
    });

    test('semanticSearchBooks returns Gemini semantic matches and filters unknown ids', async () => {
        mockBookService.getAllBooks.mockResolvedValueOnce(books);
        mockGenerateContent.mockResolvedValueOnce(geminiResponse('[{"id":2,"motivo":"Fantasia"},{"id":999,"motivo":"Invalido"}]'));

        await expect(aiService.semanticSearchBooks('quero uma jornada magica')).resolves.toEqual({
            type: 'semantic',
            results: [
                {
                    ...books[1],
                    motivo: 'Fantasia'
                }
            ]
        });
    });

    test('semanticSearchBooks uses default reason when Gemini omits motivo', async () => {
        mockBookService.getAllBooks.mockResolvedValueOnce(books);
        mockGenerateContent.mockResolvedValueOnce(geminiResponse('[{"id":2}]'));

        await expect(aiService.semanticSearchBooks('jornada magica')).resolves.toEqual({
            type: 'semantic',
            results: [
                {
                    ...books[1],
                    motivo: 'Este livro combina com a busca realizada.'
                }
            ]
        });
    });

    test('semanticSearchBooks uses fallback ranking when Gemini fails', async () => {
        mockBookService.getAllBooks.mockResolvedValueOnce([
            ...books,
            { id: 4, titulo: 'Livro Estelar', autor: 'Autora', genero: 'Aventura', descricao: 'Fantastica viagem de jornada', avaliacao: 4 }
        ]);
        mockGenerateContent.mockRejectedValueOnce(new Error('gemini down'));

        await expect(aiService.semanticSearchBooks('fantastica jornada')).resolves.toEqual({
            type: 'fallback',
            results: [
                {
                    id: 4,
                    titulo: 'Livro Estelar',
                    autor: 'Autora',
                    genero: 'Aventura',
                    descricao: 'Fantastica viagem de jornada',
                    avaliacao: 4,
                    motivo: 'Este livro possui características próximas ao que foi buscado.'
                },
                {
                    ...books[1],
                    motivo: 'Este livro possui características próximas ao que foi buscado.'
                }
            ],
            message: 'A busca inteligente está temporariamente indisponível. Exibindo resultados aproximados.'
        });
    });

    test('semanticSearchBooks fallback returns no results when no word scores', async () => {
        mockBookService.getAllBooks.mockResolvedValueOnce(books);
        mockGenerateContent.mockRejectedValueOnce(new Error('gemini down'));

        await expect(aiService.semanticSearchBooks('zzzzzz')).resolves.toEqual({
            type: 'fallback',
            results: [],
            message: 'A busca inteligente está temporariamente indisponível. Exibindo resultados aproximados.'
        });
    });
});
