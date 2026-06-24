function ReviewCard({ avaliacao }) {
  return (
    <div className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100 mt-5">

      <div className="size-10 rounded-full bg-red-400 shrink-0" />

      <div className="flex flex-col gap-1">
        <p className="font-semibold text-sm text-gray-900">
          {avaliacao.nome}
        </p>

        <p className="text-sm text-gray-600">
          {avaliacao.comentario}
        </p>

        <span className="flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full w-fit mt-1">
          ⭐ {avaliacao.nota}
        </span>
      </div>

    </div>
  );
}

export default ReviewCard;