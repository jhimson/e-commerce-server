const db = require('../');

const getAllProducts = () => db.query(`SELECT * FROM tbl_products`);

const getProduct = async(id) => db.query({
    text: `SELECT * FROM tbl_products WHERE product_id = $1`,
    values: [id]
})

const addProduct = (product) => {
    const {product_id, user_id, name, image, brand, category, description, rating,num_reviews, price, in_stock} = product;

    return db.query({
        text: `INSERT INTO tbl_products (product_id, user_id, name, image, brand,category, description, rating, num_reviews, price, in_stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`,
        values: [product_id, user_id, name, image, brand, category, description, rating,num_reviews, price, in_stock]
    })

}

const deleteProductById = (id) => db.query({text: `DELETE FROM tbl_products WHERE product_id = $1`, values: [id]})

const updateProductById = (product) => {
    const {name, image, brand, category, description, price, in_stock, product_id} = product;
    return db.query({
        text: `UPDATE tbl_products SET name = $1, image = $2, brand = $3, category = $4, description = $5, price = $6, in_stock = $7 WHERE product_id = $8 returning *`,
        values: [name, image, brand, category, description, price, in_stock, product_id]
    })
}

const updateProductRatingAndNumReviews = (product_id, rating, numReviews) => {
    return db.query({
        text: `UPDATE tbl_products SET rating = $1, num_reviews = $2 WHERE product_id = $3`,
        values: [rating, numReviews, product_id]
    })
}

const findTopProducts = () => db.query(`SELECT * FROM tbl_products ORDER BY rating DESC LIMIT 3`)

module.exports = {
    getAllProducts,
    getProduct,
    addProduct,
    deleteProductById, 
    updateProductById,
    updateProductRatingAndNumReviews,
    findTopProducts
}



