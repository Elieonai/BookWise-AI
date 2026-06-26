const { db } = require('../config/firebase');
const {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where
} = require('firebase/firestore');

const reviewsCollection = collection(db, 'reviews');

const mapReviewDocument = (doc) => ({
    id: doc.id,
    ...doc.data()
});

const getAllReviews = async (bookId) => {
    const snapshot = await getDocs(query(
        reviewsCollection,
        where('bookId', '==', Number(bookId))
    ));

    return snapshot.docs.map(mapReviewDocument);
};

const addReview = async (reviewData) => {
    if (!reviewData.bookId) {
        throw new Error('bookId is required');
    }

    if (!reviewData.nome) {
        throw new Error('nome is required');
    }

    if (!reviewData.nota) {
        throw new Error('nota is required');
    }

    if (reviewData.nota < 1 || reviewData.nota > 5) {
        throw new Error('nota must be between 1 and 5');
    }

    const newReview = {
        bookId: Number(reviewData.bookId),
        nome: reviewData.nome,
        comentario: reviewData.comentario || '',
        nota: Number(reviewData.nota),
        foto: reviewData.foto || null,
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