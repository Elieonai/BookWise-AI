function LoadingBooks() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex gap-5 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="w-32 h-44 bg-gray-200 rounded-lg" />

            <div className="flex-1 space-y-4">
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingBooks;