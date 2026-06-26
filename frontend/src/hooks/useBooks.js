{/*Junção de dados, estado e lógica de busca*/}

{/*Controle de livros, busca, carregamento, erro e filtro de livros*/}

import { useEffect, useState } from "react";
import { getBooks } from "../services/booksService";

export function useBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadBooks() {
            try {
                setLoading(true);
                const data = await getBooks();
                setBooks(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        loadBooks();
    }, []);

    // Retorna apenas os dados puros, o carregamento e possíveis erros
    return { books, loading, error };
}