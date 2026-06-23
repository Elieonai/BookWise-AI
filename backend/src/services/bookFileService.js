const fs = require('fs');
const path = require('path');

const booksFilePath = path.join(__dirname, '../../data/books.json');

const readBooks = () => {
    const data = fs.readFileSync(booksFilePath, 'utf-8');
    return JSON.parse(data);
};

module.exports = {
    readBooks
};