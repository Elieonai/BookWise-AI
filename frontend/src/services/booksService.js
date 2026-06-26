import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where
} from "firebase/firestore";
import { db } from "../config/firebase";

const booksCollection = collection(db, "books");

const mapBookDocument = (doc) => ({
    firestoreId: doc.id,
    ...doc.data()
});

export async function getBooks() {
    const snapshot = await getDocs(query(booksCollection, orderBy("id")));

    return snapshot.docs.map(mapBookDocument);
}

export async function getBookById(id) {
    const snapshot = await getDocs(query(
        booksCollection,
        where("id", "==", Number(id)),
        limit(1)
    ));

    if (snapshot.empty) {
        throw new Error("Ops! Livro não encontrado!");
    }

    return mapBookDocument(snapshot.docs[0]);
}