const asyncHandler =  require('express-async-handler')
const { v4: uuidv4 } = require('uuid');
const  { 
    getAllProducts,
    getProduct, 
    addProduct,
    deleteProductById,
    updateProductById,
    findTopProducts
} = require('../db/models/productModel')



//? @Description    Fetch all products
//? @Route          GET /api/v1/products
//? @Access         Public
const getProducts = asyncHandler(async(req, res, next) => {
    const {rows} = await getAllProducts();
    if(rows){
        res.status(200).json(rows)
    }else{
        let error = new Error('No products found in the database');
        error.status = 404;
        next(error);
    }
})


//? @Description    Fetch Single products
//? @Route          GET /api/v1/products/:id
//? @Access         Public
const getProductById = asyncHandler(async(req, res, next) => {
    const {rowCount, rows} = await getProduct(req.params.id);
    if(rowCount){
        res.status(200).json(rows[0])
    }else{
        let error = new Error('Product not found!');
        error.status = 404;
        next(error);
    }
})

//? @Description    Add new product
//? @Route          POST /api/v1/products
//? @Access         Private/Admin
const addNewProduct = asyncHandler(async(req, res, next) => {
    const product = {
        product_id: uuidv4(),
        user_id: req.user.user_id,
        name: 'sample name',
        image: '/images/sample.jpg',
        brand: 'sample brand',
        category: 'sample category',
        description: 'sample description',
        rating: 0,
        num_reviews: 0,
        price: 0,
        in_stock: 0
    }
    const {rowCount, rows} = await addProduct(product);

    if(rowCount){
        res.status(201).json({Message: 'Successfully Added new product', rows})
    }else{
        let error = new Error('Failed to add new product!');
        error.status = 500;
        next(error);
    }
})

//? @Description    Delete Single product
//? @Route          DELETE /api/v1/products/:id
//? @Access         Private/Admin
const deleteProduct = asyncHandler(async(req, res, next) => {
    const {rowCount} = await deleteProductById(req.params.id);

    if(rowCount){
        res.status(200).json({Message: 'Successfully Deleted a Product'})
    }else{
        let error = new Error('Product not found!');
        error.status = 404;
        next(error);
    }
})

//? @Description    Update product
//? @Route          PUT /api/v1/products/:id
//? @Access         Private/Admin
const updateProduct = asyncHandler(async(req, res, next) => {
    const product_id = req.params.id;
    const {name, image, brand, category, description, rating, num_reviews, price, in_stock} = req.body;
    const updatedProduct = {
        name, 
        image, 
        brand, 
        category, 
        description, 
        rating, 
        num_reviews, 
        price, 
        in_stock, 
        product_id
    }
    const {rowCount, rows} = await updateProductById(updatedProduct);
    if(rowCount){
        res.status(200).json({Message: 'Successfully update product', rows})
    }else{
        let error = new Error('Product not found!');
        error.status = 404;
        next(error);
    }
})

//? @Description    Fetch top 3 products by rating
//? @Route          GET /api/v1/products/top3
//? @Access         Public
const fetchTopProducts = asyncHandler(async(req, res, next) => {
    
    const {rowCount, rows} = await findTopProducts();

    if(rowCount){
        res.status(200).json({Message: `Successfully fetch top 3 products`, products: rows})
    }else{
        let error = new Error('No products found!');
        error.status(404);
        next(error)
    }
})

module.exports = {
    getProducts,
    getProductById,
    addNewProduct,
    deleteProduct,
    updateProduct,
    fetchTopProducts
}