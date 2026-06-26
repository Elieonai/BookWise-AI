import { useBooks } from "../hooks/useBooks";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

export default function BooksListPage() {
    // 1. Pegamos apenas os dados puros do Hook
    const { books, loading, error } = useBooks();

    // 2. Trazemos o estado de busca para a página
    const [search, setSearch] = useState("");
    
    const [page, setPage] = useState(1);
    const perPage = 6;

    const filteredBooks = books.filter(book =>
        book.titulo?.toLowerCase().includes(search.toLowerCase())
    );

    const maxPage = Math.max(1, Math.ceil(filteredBooks.length / perPage));
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);

    useEffect(() => {
        setPage(1);
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
                        onChange={setSearch} 
                    />
                </section>

                <section>
                    {filteredBooks.length === 0 ? (
                        <p className="text-lime-800">Nenhum livro encontrado.</p>
                    ) : (
                        <BookList books={booksToShow} />   
                    )}            
                </section>

                {/* PAGINAÇÃO */}
                {filteredBooks.length > 0 && (
                    <div className="flex justify-center items-center gap-6 mt-8">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            // Corrigido: Removido o text-lime-700 conflituoso
                            className="bg-lime-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-lime-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            Anterior
                        </button>
                        
                        <span className="text-lime-900">
                            Página {page}
                        </span>

                        <button
                            onClick={() => setPage(prev => Math.min(prev + 1, maxPage))}                
                            disabled={page >= maxPage}
                            // Corrigido: Removido o text-lime-700 conflituoso
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