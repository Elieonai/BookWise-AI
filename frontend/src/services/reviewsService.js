import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    where
} from "firebase/firestore";
import { db } from "../config/firebase";

const reviewsCollection = collection(db, "reviews");

const mapReviewDocument = (doc) => ({
    id: doc.id,
    ...doc.data()
});

export async function getReviews(bookId) {
    const reviewsQuery = bookId
        ? query(reviewsCollection, where("bookId", "==", Number(bookId)), orderBy("createdAt", "desc"))
        : query(reviewsCollection, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(reviewsQuery);

    return snapshot.docs.map(mapReviewDocument);
}

export async function addReview(reviewData) {
    const newReview = {
        bookId: Number(reviewData.bookId),
        nome: reviewData.nome,
        comentario: reviewData.comentario || "",
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
}