import { useBooks } from "../hooks/useBooks";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

export default function BooksListPage() {
    const { books, loading, error } = useBooks();

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState(null); // null = sem busca ativa
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchType, setSearchType] = useState(null);

    const [page, setPage] = useState(1);
    const perPage = 6;

    // Debounce — só chama a API 600ms depois que o usuário parar de digitar
    useEffect(() => {
        if (search.trim().length < 2) {
            setSearchResults(null);
            setSearchType(null);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearchLoading(true);

                const res = await fetch('/api/ai/semantic-search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: search })
                });

                const data = await res.json();
                setSearchResults(data.results);
                setSearchType(data.type);

            } catch (err) {
                console.error('Erro na busca semântica:', err);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const activeBooks = searchResults !== null ? searchResults : books;

    const maxPage = Math.max(1, Math.ceil(activeBooks.length / perPage));
    const startIndex = (page - 1) * perPage;
    const booksToShow = activeBooks.slice(startIndex, startIndex + perPage);

    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50/40 flex items-center justify-center">
                <p className="text-lime-900">Carregando livros...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-amber-50/40 flex items-center justify-center">
                <p className="text-red-600">Erro ao carregar os livros.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50/40">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-10">
                <section className="mb-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl text-lime-900 font-bold mb-4">
                        Livros
                    </h1>
                    <p className="text-base sm:text-lg text-lime-800 mb-6">
                        Explore os livros cadastrados pela comunidade!
                    </p>
                </section>

                <section className="mb-10">
                    <SearchBar value={search} onChange={setSearch} />

                    {/* Indicador do tipo de busca */}
                    {searchType === "semantic" && (
                        <p className="text-center text-sm text-lime-700 mt-2">
                            ✨ Resultados por busca inteligente
                        </p>
                    )}
                    {searchType === "fallback" && (
                        <p className="text-center text-sm text-yellow-600 mt-2">
                            ⚠️ Busca inteligente indisponível. Exibindo resultados aproximados.
                        </p>
                    )}
                    {searchType === "direct" && (
                        <p className="text-center text-sm text-gray-500 mt-2">
                            📚 Resultado direto do catálogo
                        </p>
                    )}
                    {searchLoading && (
                        <p className="text-center text-sm text-lime-600 mt-2">
                            🔍 Buscando...
                        </p>
                    )}
                </section>

                <section>
                    {activeBooks.length === 0 ? (
                        <p className="text-lime-800">Nenhum livro encontrado.</p>
                    ) : (
                        <BookList books={booksToShow} />
                    )}
                </section>

                {activeBooks.length > 0 && (
                    <div className="flex justify-center items-center gap-6 mt-8">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="bg-lime-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-lime-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            Anterior
                        </button>

                        <span className="text-lime-900">Página {page}</span>

                        <button
                            onClick={() => setPage(prev => Math.min(prev + 1, maxPage))}
                            disabled={page >= maxPage}
                            className="bg-lime-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-lime-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            Próximo
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}