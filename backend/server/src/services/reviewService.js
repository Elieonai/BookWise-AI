const { readReviews, writeReviews } = require('./fileService');          

const getAllReviews = (bookId) => {
    const reviews = readReviews();

    return reviews.filter(review => review.bookId === Number(bookId));
};

const addReview = (reviewData) => {
    const reviews = readReviews();

    if (!reviewData.bookId) {
        throw new Error('bookId is required');
    }

    if (!reviewData.nome) {
        throw new Error('nome is required');
    }

    if (!reviewData.nota) {
        throw new Error('nota is required');
    }   
    
    if (reviewData.nota < 1 || reviewData.nota > 5) {
        throw new Error('nota must be between 1 and 5');
    }  

    const newReview = {
        id: reviews.length + 1,
        bookId: Number(reviewData.bookId),
        nome: reviewData.nome,
        nota: reviewData.nota,
        commentario: reviewData.commentario || '',
        data: reviewData.data || new Date().toISOString()
    };
    
    reviews.push(newReview);
    writeReviews(reviews);

    return newReview;
};

module.exports = {
    getAllReviews,
    addReview
};