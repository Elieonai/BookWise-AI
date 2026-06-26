function ReviewCard({ review }) {
    return (
        <div className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100 mt-5">
            <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm text-gray-900">
                    {review.nome}
                </p>

                <p className="text-sm text-gray-600">
                    {review.comentario}
                </p>

                <span className="flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full w-fit mt-1">
                    ⭐ {review.nota}
                </span>
            </div>
        </div>
    );
}

export default ReviewCard;