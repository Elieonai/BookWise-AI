import { useEffect, useState } from "react";
import { getBooks } from "../services/booksService";

export function useBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBooks() {
            try {
                setLoading(true);
                setError("");
                const data = await getBooks();
                setBooks(data);
            } catch (err) {
                setError(err.message || "Erro ao carregar livros.");
            } finally {
                setLoading(false);
            }
        }

        loadBooks();
    }, []);

    return { books, loading, error };
}