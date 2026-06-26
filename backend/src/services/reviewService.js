const { db } = require('../config/firebase');
const {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where
} = require('firebase/firestore');
const { clampText, parsePositiveInt, parseRating } = require('../utils/validation');

const reviewsCollection = collection(db, 'reviews');

/* Converte documento do Firestore para resposta da API. */
const mapReviewDocument = (doc) => ({
    id: doc.id,
    ...doc.data()
});

/* Lista reviews do Firestore, com filtro opcional por livro. */
const getAllReviews = async (bookId) => {
    const parsedBookId = bookId ? parsePositiveInt(bookId, 'bookId') : undefined;
    const reviewsQuery = bookId
        ? query(reviewsCollection, where('bookId', '==', parsedBookId))
        : reviewsCollection;

    const snapshot = await getDocs(reviewsQuery);

    return snapshot.docs.map(mapReviewDocument);
};

/* Valida e cria uma review no Firestore. */
const addReview = async (reviewData) => {
    if (!reviewData.bookId) {
        throw new Error('O campo bookId é obrigatório.');
    }

    if (reviewData.nota === undefined || reviewData.nota === null || reviewData.nota === '') {
        throw new Error('O campo nota é obrigatório.');
    }

    const bookId = parsePositiveInt(reviewData.bookId, 'bookId');
    const nome = clampText(reviewData.nome, 80);
    const comentario = clampText(reviewData.comentario || '', 1000);
    const nota = parseRating(reviewData.nota);
    const foto = clampText(reviewData.foto || '', 500) || null;

    if (!nome) {
        throw new Error('O campo nome é obrigatório.');
    }

    const newReview = {
        bookId,
        nome,
        comentario,
        nota,
        foto,
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(reviewsCollection, newReview);

    return {
        id: docRef.id,
        ...newReview,
        createdAt: new Date().toISOString()
    };
};

module.exports = {
    getAllReviews,
    addReview
};