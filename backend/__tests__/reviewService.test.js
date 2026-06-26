jest.mock('../src/config/firebase', () => ({ db: { app: 'mock-db' } }));

const mockAddDoc = jest.fn();
const mockCollection = jest.fn((db, name) => ({ name }));
const mockGetDocs = jest.fn();
const mockOrderBy = jest.fn((field, direction) => ({ type: 'orderBy', field, direction }));
const mockQuery = jest.fn((...args) => ({ type: 'query', args }));
const mockServerTimestamp = jest.fn(() => 'SERVER_TIMESTAMP');
const mockWhere = jest.fn((field, operator, value) => ({ type: 'where', field, operator, value }));

jest.mock('firebase/firestore', () => ({
    addDoc: mockAddDoc,
    collection: mockCollection,
    getDocs: mockGetDocs,
    orderBy: mockOrderBy,
    query: mockQuery,
    serverTimestamp: mockServerTimestamp,
    where: mockWhere
}));

const reviewService = require('../src/services/reviewService');

const createDoc = (id, data) => ({
    id,
    data: () => data
});

describe('reviewService', () => {
    beforeEach(() => {
        jest.useRealTimers();
        mockAddDoc.mockReset();
        mockGetDocs.mockReset();
    });

    test('getAllReviews lists all reviews when no bookId is provided', async () => {
        mockGetDocs.mockResolvedValueOnce({ docs: [createDoc('r1', { bookId: 1, nota: 5 })] });

        await expect(reviewService.getAllReviews()).resolves.toEqual([
            { id: 'r1', bookId: 1, nota: 5 }
        ]);
        expect(mockGetDocs).toHaveBeenCalledWith({ name: 'reviews' });
    });

    test('getAllReviews filters reviews by bookId', async () => {
        mockGetDocs.mockResolvedValueOnce({ docs: [createDoc('r2', { bookId: 2, nota: 4 })] });

        await expect(reviewService.getAllReviews('2')).resolves.toEqual([
            { id: 'r2', bookId: 2, nota: 4 }
        ]);
        expect(mockWhere).toHaveBeenCalledWith('bookId', '==', 2);
        expect(mockQuery).toHaveBeenCalled();
    });

    test('addReview creates a valid review with default comment', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
        mockAddDoc.mockResolvedValueOnce({ id: 'created-review' });

        await expect(reviewService.addReview({ bookId: '1', nome: 'Ana', nota: '5' })).resolves.toEqual({
            id: 'created-review',
            bookId: 1,
            nome: 'Ana',
            comentario: '',
            nota: 5,
            foto: null,
            createdAt: '2026-01-01T00:00:00.000Z'
        });
        expect(mockAddDoc).toHaveBeenCalledWith({ name: 'reviews' }, {
            bookId: 1,
            nome: 'Ana',
            comentario: '',
            nota: 5,
            foto: null,
            createdAt: 'SERVER_TIMESTAMP'
        });
    });

    test.each([
        [{ nome: 'Ana', nota: 5 }, 'O campo bookId é obrigatório.'],
        [{ bookId: 1, nota: 5 }, 'O campo nome é obrigatório.'],
        [{ bookId: 1, nome: 'Ana' }, 'O campo nota é obrigatório.'],
        [{ bookId: 1, nome: 'Ana', nota: 0 }, 'A nota deve estar entre 1 e 5.'],
        [{ bookId: 1, nome: 'Ana', nota: 6 }, 'A nota deve estar entre 1 e 5.'],
        [{ bookId: 'abc', nome: 'Ana', nota: 5 }, 'bookId deve ser um número inteiro positivo.'],
        [{ bookId: 1, nome: 'Ana', nota: 'abc' }, 'A nota deve estar entre 1 e 5.']
    ])('addReview validates input %#', async (payload, message) => {
        await expect(reviewService.addReview(payload)).rejects.toThrow(message);
    });
});
