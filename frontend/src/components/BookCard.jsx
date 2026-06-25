import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <img
        src={book.capa}
        alt={book.titulo}
        className="w-32 h-44 object-cover rounded"
      />

      <div className="flex-1">
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-sm text-gray-900">
            {book.titulo}
          </h2>

          <span className="text-yellow-500 text-sm whitespace-nowrap">
            ⭐ {book.avaliacao}
          </span>
        </div>

        <p className="text-xs text-gray-600 mt-1">
          {book.autor}
        </p>

        <p className="text-xs text-gray-700 mt-2">
          {book.descricao}
        </p>

        <div className="mt-3">
          <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
            {book.genero}
          </span>
        </div>

        <Link 
          to={`/books/${book.id}`}
          className="inline-block mt-3 bg-lime-600 px-4 py-2 rounded text-xs font-s hover:bg-lime-700">Saiba Mais</Link>
        
      </div>
    </div>
  );
}

export default BookCard;