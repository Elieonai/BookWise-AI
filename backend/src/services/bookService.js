const { db } = require('../config/firebase');
const {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where
} = require('firebase/firestore');
const { parsePositiveInt } = require('../utils/validation');

const booksCollection = collection(db, 'books');
const reviewsCollection = collection(db, 'reviews');

/* Converte documento do Firestore para o formato usado pela API. */
const mapBookDocument = (doc) => ({
    firestoreId: doc.id,
    ...doc.data()
});

/* Lista livros diretamente da colecao books no Firestore. */
const getAllBooks = async () => {
    const snapshot = await getDocs(query(booksCollection, orderBy('id')));

    return snapshot.docs.map(mapBookDocument);
};

/* Busca um livro pelo campo numerico id. */
const getBookById = async (id) => {
    const bookId = parsePositiveInt(id, 'id');
    const snapshot = await getDocs(query(
        booksCollection,
        where('id', '==', bookId),
        limit(1)
    ));

    if (snapshot.empty) {
        throw new Error('Livro não encontrado');
    }

    return mapBookDocument(snapshot.docs[0]);
};

/* Lista livros com media calculada a partir das reviews do Firestore. */
const getTopRatedBooks = async (limitCount = 6) => {
    const safeLimit = parsePositiveInt(limitCount, 'limit');
    const [books, reviewsSnapshot] = await Promise.all([
        getAllBooks(),
        getDocs(reviewsCollection)
    ]);
    const reviews = reviewsSnapshot.docs.map(doc => doc.data());
    const ratingsByBook = reviews.reduce((acc, review) => {
        const bookId = Number(review.bookId);

        if (!acc[bookId]) {
            acc[bookId] = { total: 0, count: 0 };
        }

        acc[bookId].total += Number(review.nota);
        acc[bookId].count += 1;

        return acc;
    }, {});

    return books
        .map(book => {
            const rating = ratingsByBook[Number(book.id)] || { total: 0, count: 0 };
            const average = rating.count ? rating.total / rating.count : 0;

            return {
                ...book,
                avaliacao: Number(average.toFixed(1)),
                totalAvaliacoes: rating.count
            };
        })
        .filter((book) => book.totalAvaliacoes > 0)
        .sort((a, b) => b.avaliacao - a.avaliacao)
        .slice(0, safeLimit);
};

module.exports = {
    getAllBooks,
    getBookById,
    getTopRatedBooks
};
