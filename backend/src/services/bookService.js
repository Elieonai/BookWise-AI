const { db } = require('../config/firebase');
const {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where
} = require('firebase/firestore');

const booksCollection = collection(db, 'books');

const mapBookDocument = (doc) => ({
    firestoreId: doc.id,
    ...doc.data()
});

const getAllBooks = async () => {
    const snapshot = await getDocs(query(booksCollection, orderBy('id')));

    return snapshot.docs.map(mapBookDocument);
};

const getBookById = async (id) => {
    const snapshot = await getDocs(query(
        booksCollection,
        where('id', '==', Number(id)),
        limit(1)
    ));

    if (snapshot.empty) {
        throw new Error('Livro não encontrado');
    }

    return mapBookDocument(snapshot.docs[0]);
};

module.exports = {
    getAllBooks,
    getBookById
};