import { useEffect, useState } from "react";

export function useTopRatedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTopRatedBooks() {
      try {
        setLoading(true);

        const response = await fetch("http://localhost:3000/api/books/top-rated");

        if (!response.ok) {
          throw new Error("Erro ao buscar livros mais bem avaliados");
        }

        const data = await response.json();

        setBooks(data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchTopRatedBooks();
  }, []);

  return {
    books,
    loading,
    error,
  };
}