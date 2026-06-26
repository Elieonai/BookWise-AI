require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db } = require('../config/firebase');
const { collection, getDocs } = require('firebase/firestore');
const bookService = require('./bookService');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRecommendations = async (bookTitle) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
            Você é um especialista em literatura.
            Retorne EXCLUSIVAMENTE um array JSON, sem crases markdown, sem texto adicional.
            O array deve seguir ESTRITAMENTE esta estrutura:
            [
                {
                    "livro": "Título do livro",
                    "autor": "Nome do autor",
                    "sinopse": "Breve descrição do livro"
                }
            ]
            Recomende 3 livros similares a: "${bookTitle}"
        `;

        const respostaBruta = await model.generateContent(prompt);
        const textoDaResposta = respostaBruta.response.text();

        const stringJsonLimpa = textoDaResposta
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        return JSON.parse(stringJsonLimpa);

    } catch (error) {
        console.error('Erro Gemini:', error);
        return getFallbackRecommendations();
    }
};

const getAllReviews = async () => {
    const snapshot = await getDocs(collection(db, 'reviews'));

    return snapshot.docs.map(doc => doc.data());
};

const getTopRatedBooks = async () => {
    const reviews = await getAllReviews();
    const grouped = {};

    for (const review of reviews) {
        if (!grouped[review.bookId]) {
            grouped[review.bookId] = { total: 0, count: 0 };
        }
        grouped[review.bookId].total += review.nota;
        grouped[review.bookId].count += 1;
    }

    return Object.entries(grouped)
        .map(([bookId, data]) => ({
            bookId: Number(bookId),
            avg: data.total / data.count
        }))
        .sort((a, b) => b.avg - a.avg);
};

const getFallbackRecommendations = async () => {
    const ranked = await getTopRatedBooks();
    const books = await bookService.getAllBooks();

    if (ranked.length > 0) {
        return ranked.slice(0, 3).map(rank => {
            const book = books.find(b => b.id === rank.bookId);
            return { livro: book?.titulo, autor: book?.autor, sinopse: book?.descricao };
        });
    }

    return [...books]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(book => ({ livro: book.titulo, autor: book.autor, sinopse: book.descricao }));
};

module.exports = { getRecommendations };