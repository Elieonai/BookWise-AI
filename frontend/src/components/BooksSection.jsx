import SearchBar from "./SearchBar";
import BookList from "./BookList";

function BooksSection({ books, search, setSearch }) {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900">
          Livros da comunidade
        </h2>

        <p className="text-gray-600 mt-2">
          Explore os livros cadastrados e descubra novas leituras.
        </p>
      </header>

      <section className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </section>

      <p className="text-sm text-gray-500 mb-6">
        {books.length} livro{books.length !== 1 && "s"} encontrado
        {books.length !== 1 && "s"}.
      </p>

      {books.length > 0 ? (
        <BookList books={books} />
      ) : (
        <div className="bg-white border rounded-xl p-8 text-center shadow-sm">
          <p className="text-gray-600">
            Nenhum livro encontrado com essa busca.
          </p>
        </div>
      )}
    </main>
  );
}

export default BooksSection;