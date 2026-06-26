const { readBooks } = require("./bookFileService");
const { readReviews } = require("./fileService");

const calcularMediaAvaliacoes = (bookId) => {
  const reviews = readReviews();

  const reviewsDoLivro = reviews.filter(
    (review) => review.bookId === Number(bookId)
  );

  if (reviewsDoLivro.length === 0) {
    return {
      avaliacao: 0,
      totalAvaliacoes: 0,
    };
  }

  const somaNotas = reviewsDoLivro.reduce((total, review) => {
    return total + Number(review.nota);
  }, 0);

  const media = somaNotas / reviewsDoLivro.length;

  return {
    avaliacao: Number(media.toFixed(1)),
    totalAvaliacoes: reviewsDoLivro.length,
  };
};

const adicionarAvaliacaoAoLivro = (book) => {
  const dadosAvaliacao = calcularMediaAvaliacoes(book.id);

  return {
    ...book,
    avaliacao: dadosAvaliacao.avaliacao,
    totalAvaliacoes: dadosAvaliacao.totalAvaliacoes,
  };
};

const getAllBooks = () => {
  const books = readBooks();

  return books.map((book) => adicionarAvaliacaoAoLivro(book));
};

const getBookById = (id) => {
  const books = readBooks();
  const book = books.find((book) => book.id === Number(id));

  if (!book) {
    throw new Error("Livro não encontrado");
  }

  return adicionarAvaliacaoAoLivro(book);
};

const getTopRatedBooks = (limit = 6) => {
  const books = getAllBooks();

  return books
    .filter((book) => book.totalAvaliacoes > 0)
    .sort((a, b) => b.avaliacao - a.avaliacao)
    .slice(0, limit);
};

module.exports = {
  getAllBooks,
  getBookById,
  getTopRatedBooks,
};