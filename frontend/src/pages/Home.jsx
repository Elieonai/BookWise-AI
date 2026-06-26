import { useBooks } from "../hooks/useBooks";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import BooksSection from "../components/BooksSection";
import LoadingBooks from "../components/LoadingBooks";
import StatsSection from "../components/StatsSection";
import CapivAIChat from "../components/CapivAIChat";

function Home() {
  const { books, search, setSearch, loading, error } = useBooks();

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/40">
        <Navbar />
        <Hero />
        <StatsSection />
        <LoadingBooks />
        <Footer />
        <CapivAIChat />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50/40">
        <Navbar />
        <Hero />
        <StatsSection />

        <main className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-white border border-red-200 rounded-xl p-8 text-center shadow-sm">
            <p className="text-red-600 font-semibold">
              Erro ao carregar os livros.
            </p>
          </div>
        </main>

        <Footer />
        <CapivAIChat />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/40">
      <Navbar />

      <Hero />

      <StatsSection />

      <BooksSection
        books={books}
        search={search}
        setSearch={setSearch}
      />

      <Footer />

      <CapivAIChat />
    </div>
  );
}

export default Home;