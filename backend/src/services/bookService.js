const { readBooks } = require('./bookFileService');

const getAllBooks = () => {
    return readBooks();
};

const getBookById = (id) => {
    const books = readBooks();
    const book = books.find(book => book.id === Number(id));

    if (!book) {
        throw new Error('Livro não encontrado');
    }

    return book;
};

module.exports = {
    getAllBooks,
    getBookById
};