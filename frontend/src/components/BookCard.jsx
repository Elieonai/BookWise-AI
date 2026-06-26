import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
    <article className="group flex gap-5 bg-white p-4 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1">
      <div className="w-32 h-44 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={book.capa}
          alt={`Capa do livro ${book.titulo}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-lg text-gray-900 leading-snug">
            {book.titulo}
          </h2>

          <span className="text-yellow-500 text-sm whitespace-nowrap font-semibold">
            ⭐ {book.avaliacao}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-1">
          por {book.autor}
        </p>

        <p className="text-sm text-gray-700 mt-3 line-clamp-3">
          {book.descricao}
        </p>

        <div className="mt-4">
          <span className="bg-lime-50 text-lime-700 border border-lime-200 px-3 py-1 rounded-full text-xs font-medium">
            {book.genero}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <Link
            to={`/books/${book.id}`}
            className="inline-flex items-center gap-2 bg-lime-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-lime-700 transition-colors"
          >
            Saiba Mais
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default BookCard;