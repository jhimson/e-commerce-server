const express = require('express');
const Router = express.Router();
const {protect} = require('../middleware/authMiddleware')
const {addNewReview, fetchAllReviewsByProductId} = require('../controllers/reviewController')

Router.route('/:id')
.get(fetchAllReviewsByProductId)
.post(protect, addNewReview)

module.exports = Router;