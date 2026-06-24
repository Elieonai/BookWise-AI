import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const booksFilePath = path.join(__dirname, "../../data/books.json");
const reviewsFilePath = path.join(__dirname, "../../data/reviews.json");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getBooks = () => {
    const data = fs.readFileSync(booksFilePath, "utf-8");
    return JSON.parse(data);
};

const getReviews = () => {
    const data = fs.readFileSync(reviewsFilePath, "utf-8");
    return JSON.parse(data).reviews;
};

const getRecommendations = async (bookTitle) => {
    
    try {
        const prompt = `
        Livro: ${bookTitle}

        Recomende 3 livros similares.
        Retorne APENAS JSON:

        [
        {
            "livro": "",
            "autor": "",
            "sinopse": ""
        }
        ]
        `;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const content = response.choices[0].message.content;

        return JSON.parse(content);

    } catch (error) {
        console.error("Erro OpenAI:", error);
        return getFallbackRecommendations();
    }
};

const getTopRatedBooks = () => {
    const reviews = getReviews();

    const grouped = {};

    for (const review of reviews) {
        if (!grouped[review.bookId]) {
            grouped[review.bookId] = {
                total: 0,
                count: 0
            };
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
            const book = books.find(
                b => b.id === rank.bookId
            );

            return {
                livro: book?.titulo,
                autor: book?.autor,
                sinopse: book?.sinopse
            };
        });
    }

    const randomBooks = [...books]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    return randomBooks.map(book => ({
        livro: book.titulo,
        autor: book.autor,
        sinopse: book.sinopse
    }));
};

export { getRecommendations };