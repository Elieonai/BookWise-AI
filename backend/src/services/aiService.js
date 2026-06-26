require('dotenv').config();
const { readReviews } = require("./fileService");
const { readBooks } = require("./bookFileService");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const booksFilePath = path.join(__dirname, '../../data/books.json');
const reviewsFilePath = path.join(__dirname, '../../data/reviews.json');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getBooks = () => {
    const data = fs.readFileSync(booksFilePath, 'utf-8');
    return JSON.parse(data);
};

const getReviews = () => {
    const data = fs.readFileSync(reviewsFilePath, 'utf-8');
    return JSON.parse(data).reviews;
};

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

const getTopRatedBooks = () => {
    const reviews = getReviews();
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

const getFallbackRecommendations = () => {
    const ranked = getTopRatedBooks();
    const books = getBooks();

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

const generateReviewSummary = async (bookId) => {
    const books = readBooks();
    const reviews = readReviews();

    const book = books.find(book => book.id === Number(bookId));

    if (!book) {
        return {
            summary: "Livro não encontrado."
        };
    }

    const bookReviews = reviews.filter(
        review => review.bookId === Number(bookId)
    );

    if (bookReviews.length < 2) {
        return {
            summary: "Ainda não há avaliações suficientes para gerar um resumo."
        };
    }

    const reviewsText = bookReviews
        .map((review, index) => `
Avaliação ${index + 1}
Nota: ${review.nota}
Comentário: ${review.comentario}
        `)
        .join("\n----------------------\n");

    const prompt = `
Você é um assistente especializado em literatura.

Livro:
Título: ${book.titulo}
Autor: ${book.autor}
Gênero: ${book.genero}
Descrição: ${book.descricao}

Com base APENAS nas avaliações abaixo, gere um resumo da opinião da comunidade.

Regras:
- Escreva entre 50 e 90 palavras.
- Destaque principais elogios.
- Destaque eventuais críticas.
- Informe o sentimento geral dos leitores.
- Não cite nomes de usuários.
- Não invente informações.
- Não use listas.
- Retorne SOMENTE JSON.

Formato:
{
  "summary": "..."
}

Avaliações:
${reviewsText}
`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const respostaBruta = await model.generateContent(prompt);
        const textoDaResposta = respostaBruta.response.text();

        const stringJsonLimpa = textoDaResposta
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(stringJsonLimpa);

    } catch (error) {
        console.error("Erro Gemini ao resumir reviews:", error);

        return {
            summary: "No momento não foi possível gerar um resumo automático das avaliações."
        };
    }
};

module.exports = {
    getRecommendations,
    generateReviewSummary
};