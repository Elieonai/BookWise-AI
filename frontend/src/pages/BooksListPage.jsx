import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import { useBooks } from "../hooks/useBooks";

const apiBaseUrl = import.meta.env.VITE_AI_API_URL?.replace(/\/$/, "");

export default function BooksListPage() {
    const { books, loading, error } = useBooks();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [apiSearchResults, setApiSearchResults] = useState(null);
    const [apiSearchType, setApiSearchType] = useState("");
    const [apiSearchLoading, setApiSearchLoading] = useState(false);
    const [apiSearchError, setApiSearchError] = useState("");
    const perPage = 6;

    const firestoreFilteredBooks = books.filter(book =>
        book.titulo?.toLowerCase().includes(search.toLowerCase())
    );
    const activeBooks = apiSearchResults ?? firestoreFilteredBooks;
    const showMissingApiMessage = search.trim().length >= 2 && !apiBaseUrl;
    const maxPage = Math.max(1, Math.ceil(activeBooks.length / perPage));
    const startIndex = (page - 1) * perPage;
    const booksToShow = activeBooks.slice(startIndex, startIndex + perPage);

    function handleSearchChange(value) {
        setSearch(value);
        setPage(1);
        setApiSearchError("");
        setApiSearchType("");

        if (value.trim().length < 2) {
            setApiSearchResults(null);
            setApiSearchLoading(false);
        }
    }

    useEffect(() => {
        const normalizedSearch = search.trim();

        if (normalizedSearch.length < 2) {
            return undefined;
        }

        if (!apiBaseUrl) {
            return undefined;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                setApiSearchLoading(true);

                const response = await fetch(`${apiBaseUrl}/ai/semantic-search`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query: normalizedSearch }),
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar livros pela API.");
                }

                const data = await response.json();

                setApiSearchResults(data.results ?? []);
                setApiSearchType(data.type ?? "");
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Erro na busca inteligente:", err);
                    setApiSearchResults(null);
                    setApiSearchError("Busca inteligente indisponível. Exibindo resultados do Firestore.");
                }
            } finally {
                setApiSearchLoading(false);
            }
        }, 600);

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [search]);

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
                    <SearchBar
                        value={search}
                        onChange={handleSearchChange}
                    />

                    {apiSearchLoading && (
                        <p className="text-center text-sm text-lime-700 mt-2">
                            Buscando na API inteligente...
                        </p>
                    )}

                    {apiSearchType === "semantic" && (
                        <p className="text-center text-sm text-lime-700 mt-2">
                            Resultados encontrados pela API inteligente.
                        </p>
                    )}

                    {apiSearchType === "fallback" && (
                        <p className="text-center text-sm text-yellow-700 mt-2">
                            API inteligente indisponível. Exibindo resultados aproximados.
                        </p>
                    )}

                    {apiSearchType === "direct" && (
                        <p className="text-center text-sm text-gray-600 mt-2">
                            Resultado direto do catálogo usado pela API.
                        </p>
                    )}

                    {apiSearchError && (
                        <p className="text-center text-sm text-yellow-700 mt-2">
                            {apiSearchError}
                        </p>
                    )}

                    {showMissingApiMessage && (
                        <p className="text-center text-sm text-yellow-700 mt-2">
                            API de busca inteligente não configurada. Exibindo resultados do Firestore.
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
                            type="button"
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="bg-lime-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-lime-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>

                        <span className="text-lime-900">
                            Página {page}
                        </span>

                        <button
                            type="button"
                            onClick={() => setPage(prev => Math.min(prev + 1, maxPage))}
                            disabled={page >= maxPage}
                            className="bg-lime-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-lime-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Próximo
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}