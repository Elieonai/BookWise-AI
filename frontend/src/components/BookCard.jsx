import { Link } from "react-router-dom";

function BookCard({ livro }) {
  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <img
        src={livro.capa}
        alt={livro.titulo}
        className="w-32 h-44 object-cover rounded"
      />

      <div className="flex-1">
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-sm text-gray-900">
            {livro.titulo}
          </h2>

          <span className="text-yellow-500 text-sm whitespace-nowrap">
            ⭐ {livro.avaliacao}
          </span>
        </div>

        <p className="text-xs text-gray-600 mt-1">
          {livro.autor}
        </p>

        <p className="text-xs text-gray-700 mt-2">
          {livro.descricao}
        </p>

        <div className="mt-3">
          <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
            {livro.genero}
          </span>
        </div>

        <Link 
          to={`/livros/${livro.id}`}
          className="inline-block mt-3 bg-lime-600 px-4 py-2 rounded text-xs font-s hover:bg-lime-700">Saiba Mais</Link>
        
      </div>
    </div>
  );
}

export default BookCard;