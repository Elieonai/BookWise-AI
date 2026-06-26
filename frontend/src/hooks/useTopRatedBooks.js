import { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_AI_API_URL?.replace(/\/$/, "");

export function useTopRatedBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchTopRatedBooks() {
            try {
                setLoading(true);
                setError("");

                if (!apiBaseUrl) {
                    throw new Error("VITE_AI_API_URL não configurada.");
                }

                const response = await fetch(`${apiBaseUrl}/books/top-rated`);

                if (!response.ok) {
                    throw new Error("Erro ao buscar livros mais bem avaliados.");
                }

                const data = await response.json();

                setBooks(data);
            } catch (error) {
                console.error(error);
                setError(error.message || "Erro ao buscar livros mais bem avaliados.");
            } finally {
                setLoading(false);
            }
        }

        fetchTopRatedBooks();
    }, []);

    return {
        books,
        loading,
        error
    };
}