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

const normalizeText = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

const directSearchBooks = (query, books) => {
    const normalizedQuery = normalizeText(query);

    return books.filter(book => {
        const titulo = normalizeText(book.titulo);
        const autor = normalizeText(book.autor);
        const genero = normalizeText(book.genero);
        const descricao = normalizeText(book.descricao);

        return (
            titulo.includes(normalizedQuery) ||
            autor.includes(normalizedQuery) ||
            genero.includes(normalizedQuery) ||
            descricao.includes(normalizedQuery)
        );
    });
};

const fallbackSemanticSearch = (query, books) => {
    const normalizedQuery = normalizeText(query);

    const queryWords = normalizedQuery
        .split(/\s+/)
        .filter(word => word.length > 3);

    const rankedBooks = books
        .map(book => {
            const searchableText = normalizeText(
                `${book.titulo} ${book.autor} ${book.genero} ${book.descricao}`
            );

            const score = queryWords.reduce((total, word) => {
                return searchableText.includes(word) ? total + 1 : total;
            }, 0);

            return {
                book,
                score
            };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

    return rankedBooks.slice(0, 5).map(item => ({
        ...item.book,
        motivo: "Este livro possui características próximas ao que foi buscado."
    }));
};

const semanticSearchBooks = async (query) => {
    const books = readBooks();

    if (!query || query.trim().length < 2) {
        return {
            type: "empty",
            results: [],
            message: "Digite pelo menos 2 caracteres para buscar."
        };
    }

    const directResults = directSearchBooks(query, books);

    if (directResults.length > 0) {
        return {
            type: "direct",
            results: directResults.map(book => ({
                ...book,
                motivo: "Encontrado diretamente no catálogo."
            }))
        };
    }

    const catalogText = books
        .map(book => `
ID: ${book.id}
Título: ${book.titulo}
Autor: ${book.autor}
Gênero: ${book.genero}
Descrição: ${book.descricao}
Avaliação: ${book.avaliacao}
`)
        .join("\n----------------------\n");

    const prompt = `
Você é um assistente especializado em recomendação de livros.

O usuário fez a seguinte busca:
"${query}"

Sua tarefa é recomendar até 5 livros do catálogo abaixo que mais combinam semanticamente com o pedido.

REGRAS:
- Escolha APENAS livros existentes no catálogo.
- Não invente livros.
- Não altere os IDs.
- Retorne no máximo 5 livros.
- Se nenhum livro combinar, retorne array vazio.
- O motivo deve explicar de forma curta por que o livro combina com a busca.
- Retorne SOMENTE JSON, sem markdown e sem texto adicional.

Formato obrigatório:
[
  {
    "id": 1,
    "motivo": "..."
  }
]

Catálogo:
${catalogText}
`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const respostaBruta = await model.generateContent(prompt);
        const textoDaResposta = respostaBruta.response.text();

        const stringJsonLimpa = textoDaResposta
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const aiResults = JSON.parse(stringJsonLimpa);

        const results = aiResults
            .map(result => {
                const book = books.find(book => book.id === Number(result.id));

                if (!book) return null;

                return {
                    ...book,
                    motivo: result.motivo || "Este livro combina com a busca realizada."
                };
            })
            .filter(Boolean);

        return {
            type: "semantic",
            results
        };

    } catch (error) {
        console.error("Erro Gemini na busca semântica:", error);

        const fallbackResults = fallbackSemanticSearch(query, books);

        return {
            type: "fallback",
            results: fallbackResults,
            message: "A busca inteligente está temporariamente indisponível. Exibindo resultados aproximados."
        };
    }
};

module.exports = {
    getRecommendations,
    generateReviewSummary,
    semanticSearchBooks
};