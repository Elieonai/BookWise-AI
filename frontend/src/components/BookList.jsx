import BookCard from "./BookCard";

function BookList({ livros }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {livros.map((livro) => (
        <BookCard key={livro.id} livro={livro} />
      ))}
    </div>
  );
}

export default BookList;