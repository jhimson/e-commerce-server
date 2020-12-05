const db = require('..');

const createReview = (review) => {
    const {rating_id, user_id, rating, comment, product_id} = review;
    return db.query({
        text: `INSERT INTO tbl_reviews (rating_id, user_id, rating, comment, created_at, updated_at, product_id) VALUES ($1, $2, $3, $4, DEFAULT, DEFAULT, $5)`,
        values: [rating_id, user_id, rating, comment, product_id]
    })
}


const findReviewByUserIdAndProductId = (user_id, product_id) => {
    return db.query({
        text: `SELECT * FROM tbl_reviews WHERE user_id = $1 AND product_id = $2`,
        values: [user_id, product_id]
    })
}

const fetchReviewsByProductId = (product_id) => {
    return db.query({
        text: `SELECT u.username, r.*  FROM tbl_reviews r
        INNER JOIN tbl_users u ON r.user_id = u.user_id WHERE product_id = $1`,
        values: [product_id]
    })
}


module.exports = {
    createReview,
    findReviewByUserIdAndProductId,
    fetchReviewsByProductId
}