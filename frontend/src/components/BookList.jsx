import BookCard from "./BookCard";

export default function BookList({ books }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {(books ?? []).map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

