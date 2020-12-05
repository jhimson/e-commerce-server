const express = require('express')
const Router = express.Router();
const {protect, isAdmin} = require('../middleware/authMiddleware')
const {
    getProducts, 
    getProductById,
    addNewProduct,
    deleteProduct,
    updateProduct,
    fetchTopProducts
} = require('../controllers/productController')

Router.route('/')
.get(getProducts)
.post(protect, isAdmin, addNewProduct)

Router.route('/top').get(fetchTopProducts)

Router.route('/:id')
.get(getProductById)
.delete(protect, isAdmin, deleteProduct)
.put(protect, isAdmin, updateProduct)



module.exports = Router;