jest.mock('../src/config/firebase', () => ({ db: { app: 'mock-db' } }));

const mockCollection = jest.fn((db, name) => ({ name }));
const mockGetDocs = jest.fn();
const mockLimit = jest.fn((value) => ({ type: 'limit', value }));
const mockOrderBy = jest.fn((field) => ({ type: 'orderBy', field }));
const mockQuery = jest.fn((...args) => ({ type: 'query', args }));
const mockWhere = jest.fn((field, operator, value) => ({ type: 'where', field, operator, value }));

jest.mock('firebase/firestore', () => ({
    collection: mockCollection,
    getDocs: mockGetDocs,
    limit: mockLimit,
    orderBy: mockOrderBy,
    query: mockQuery,
    where: mockWhere
}));

const bookService = require('../src/services/bookService');

const createDoc = (id, data) => ({
    id,
    data: () => data
});

describe('bookService', () => {
    beforeEach(() => {
        mockGetDocs.mockReset();
    });

    test('getAllBooks maps Firestore books ordered by id', async () => {
        mockGetDocs.mockResolvedValueOnce({
            docs: [createDoc('fire-1', { id: 1, titulo: 'Dom Casmurro' })]
        });

        await expect(bookService.getAllBooks()).resolves.toEqual([
            { firestoreId: 'fire-1', id: 1, titulo: 'Dom Casmurro' }
        ]);
        expect(mockOrderBy).toHaveBeenCalledWith('id');
    });

    test('getBookById returns the first matching book', async () => {
        mockGetDocs.mockResolvedValueOnce({
            empty: false,
            docs: [createDoc('fire-2', { id: 2, titulo: 'O Pequeno Principe' })]
        });

        await expect(bookService.getBookById('2')).resolves.toEqual({
            firestoreId: 'fire-2',
            id: 2,
            titulo: 'O Pequeno Principe'
        });
        expect(mockWhere).toHaveBeenCalledWith('id', '==', 2);
        expect(mockLimit).toHaveBeenCalledWith(1);
    });

    test('getBookById throws when the book does not exist', async () => {
        mockGetDocs.mockResolvedValueOnce({ empty: true, docs: [] });

        await expect(bookService.getBookById('99')).rejects.toThrow('Livro não encontrado');
    });

    test('getBookById validates invalid id', async () => {
        await expect(bookService.getBookById('abc')).rejects.toThrow('id deve ser um número inteiro positivo.');
        expect(mockGetDocs).not.toHaveBeenCalled();
    });

    test('getTopRatedBooks calculates averages from reviews and applies limit', async () => {
        mockGetDocs
            .mockResolvedValueOnce({
                docs: [
                    createDoc('book-1', { id: 1, titulo: 'Livro A' }),
                    createDoc('book-2', { id: 2, titulo: 'Livro B' }),
                    createDoc('book-3', { id: 3, titulo: 'Livro C' })
                ]
            })
            .mockResolvedValueOnce({
                docs: [
                    createDoc('review-1', { bookId: 1, nota: 4 }),
                    createDoc('review-2', { bookId: 1, nota: 5 }),
                    createDoc('review-3', { bookId: 2, nota: 3 })
                ]
            });

        await expect(bookService.getTopRatedBooks(1)).resolves.toEqual([
            {
                firestoreId: 'book-1',
                id: 1,
                titulo: 'Livro A',
                avaliacao: 4.5,
                totalAvaliacoes: 2
            }
        ]);
    });

    test('getTopRatedBooks returns an empty list when no book has reviews', async () => {
        mockGetDocs
            .mockResolvedValueOnce({ docs: [createDoc('book-1', { id: 1, titulo: 'Livro A' })] })
            .mockResolvedValueOnce({ docs: [] });

        await expect(bookService.getTopRatedBooks()).resolves.toEqual([]);
    });

    test('getTopRatedBooks validates invalid limit', async () => {
        await expect(bookService.getTopRatedBooks(0)).rejects.toThrow('limit deve ser um número inteiro positivo.');
        expect(mockGetDocs).not.toHaveBeenCalled();
    });
});
