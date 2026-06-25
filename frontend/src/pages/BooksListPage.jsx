import { useBooks } from "../hooks/useBooks";
import Navbar from "../components/Navbar";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

export default function BooksListPage() {
    const {
        books,
        search,
        setSearch,
        loading,
        error
    } = useBooks();

    if (loading) return <p>Carregando Livros...</p>;
    if (error) return <p>Erro ao carregar a página!</p>;

    return (
        <>

        <div className="min-h-screen bg-amber-50/40">

            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-10">
                <section className="mb-10">
                    <h1 className="text-5xl mb-3">
                        Livros
                    </h1>

                    <p className="text-gray-600">
                        Explore os livros cadastrados pela comunidade!
                    </p>
                </section>

                <section className="mb-10">
                    <SearchBar 
                        value={search}
                        onChange={setSearch} />
                </section>

                <section>
                    <BookList books={books} />
                </section>
            </main>
            <Footer />
        </div>
        </>
    );
}