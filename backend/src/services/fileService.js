const fs = require('fs');
const path = require('path');

const reviewsFilePath = path.join(__dirname, '../../data/reviews.json');

/* Le reviews locais legadas usadas por scripts e testes. */
const readReviews = () => {
    const data = fs.readFileSync(reviewsFilePath, 'utf-8');
    return JSON.parse(data).reviews;
};

/* Persiste reviews no arquivo local legado. */
const writeReviews = (reviews) => {
    const data = { reviews };
    fs.writeFileSync(reviewsFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = {
    readReviews,
    writeReviews
};