import { useTopRatedBooks } from "../hooks/useTopRatedBooks";
import BookList from "../components/BookList";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

function Home() {
  const { books, loading, error } = useTopRatedBooks();

  return (
    <div className="min-h-screen bg-amber-50/40 scroll-smooth">
      <Navbar />

      <Hero />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <section
          id="top-rated-books"
          className="mt-10 scroll-mt-24"
        >
          <h2 className="text-3xl font-bold text-lime-900 mb-2">
            Livros mais bem avaliados
          </h2>

          <p className="text-gray-600 mb-8">
            Descubra os livros favoritos da comunidade Capiventure.
          </p>

          {loading && (
            <p className="text-center text-lime-800 font-semibold">
              Carregando livros mais bem avaliados...
            </p>
          )}

          {error && (
            <p className="text-center text-red-600 font-semibold">
              Erro ao carregar os livros mais bem avaliados.
            </p>
          )}

          {!loading && !error && <BookList books={books} />}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;