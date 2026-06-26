require('dotenv').config();
const { db } = require('../src/config/firebase');
const { collection, doc, setDoc, writeBatch } = require('firebase/firestore');
const books = require('../data/books.json');
const reviewsData = require('../data/reviews.json');

const seedCollection = async (collectionName, records, getDocumentId) => {
    const batch = writeBatch(db);

    records.forEach((record) => {
        const docId = getDocumentId(record);
        const docRef = doc(collection(db, collectionName), docId);
        batch.set(docRef, record);
    });

    await batch.commit();
};

const seedFirestore = async () => {
    await seedCollection('books', books, book => String(book.id));
    await seedCollection('reviews', reviewsData.reviews, review => String(review.id));

    console.log('Firestore populado com livros e reviews iniciais.');
};

if (require.main === module) {
    seedFirestore()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Erro ao popular Firestore:', error);
            process.exit(1);
        });
}

module.exports = { seedFirestore };