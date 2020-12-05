const asyncHandler =  require('express-async-handler')
const { v4: uuidv4 } = require('uuid');

const { 
    createReview,
    findReviewByUserIdAndProductId,
    fetchReviewsByProductId
 } = require('../db/models/reviewModel')

 const {
    updateProductRatingAndNumReviews,
    getProduct
 } = require('../db/models/productModel')

//? @Description    Create new review
//? @Route          POST /api/v1/reviews
//? @Access         Public
const addNewReview = asyncHandler(async(req, res, next) => {
    const product_id = req.params.id;
    const user_id = req.user.user_id;
    const {rating, comment} = req.body;
    const {rowCount: alreadyReviewed} = await findReviewByUserIdAndProductId(user_id, product_id);
    const {rows:Product} = await getProduct(product_id)

    let newNumReviews = 0;
    let averageRating = 0;
    if(alreadyReviewed){
        let error = new Error('Product already reviewed');
        error.status = 404;
        next(error);
        
    }else{
        if(Product.length !== 0){
            if(Number(Product[0].num_reviews) === 0){
                newNumReviews = 1
            }else{
                newNumReviews = Number(Product[0].num_reviews) + 1
            }
        }
        const newReview = {
            rating_id: uuidv4(),
            user_id,
            rating: Number(rating),
            comment,
            product_id
        }
        const { rowCount: successCreateReview } = await createReview(newReview);
        if(successCreateReview){
            const {rowCount: reviewsCount, rows: productReviews} = await fetchReviewsByProductId(product_id)
            if(reviewsCount){
               averageRating = productReviews.reduce((accu, product) => Number(product.rating) + accu, 0) / productReviews.length
            }
            const {rowCount: successUpdate} = await updateProductRatingAndNumReviews(product_id, averageRating, newNumReviews)
            if(successUpdate){
                res.status(201).json({Message: 'Successfully Created new review'});
            }
        }
    }

})

const fetchAllReviewsByProductId = asyncHandler(async(req, res, next) => {
    const product_id = req.params.id;
    const {rowCount, rows:reviews} = await fetchReviewsByProductId(product_id);

    if(rowCount){
        res.status(200).json({Message: `Successfully fetched reviews`, reviews})
    }else{
        let error = new Error('No reviews found!');
        error.status = 404;
        next(error);
    }
})

module.exports = {
    addNewReview,
    fetchAllReviewsByProductId
}