const db = require('../')


const addOrderItem = (orderDetails) => {
    const {order_id, product_id, user_id, quantity, payment_method, payment_email_address,shipping_address, shipping_city, shipping_postal_code,shipping_country} = orderDetails

    
    return db.query({
        text: `INSERT INTO tbl_orders (order_id, product_id, user_id, quantity, payment_method, payment_status, payment_email_address, payment_update_time, is_paid, is_delivered, paid_at, delivered_at, created_at, shipping_address, shipping_city, shipping_postal_code,shipping_country) VALUES ($1, $2, $3, $4, $5, NULL, $6, NULL, DEFAULT, DEFAULT, NULL, NULL, DEFAULT, $7, $8, $9, $10) returning *`,
        values: [order_id, product_id, user_id, quantity, payment_method, payment_email_address,shipping_address, shipping_city, shipping_postal_code,shipping_country]
    })
};


const getOrderItemsByUserId = (user_id) => {
    return db.query({
        text: `SELECT o.order_id,o.user_id,p.name, p.price, o.quantity, o.payment_method, o.payment_status, o.payment_email_address, o.is_paid, 
        o.is_delivered, o.paid_at,o.delivered_at, (p.price * o.quantity) as total,shipping_address, shipping_city, shipping_postal_code, shipping_country FROM tbl_orders o JOIN tbl_products p ON o.product_id = p.product_id WHERE o.user_id = $1`,
        values: [user_id]
    })
}



const getOrderDetailsByOrderIdAndUserId_limitOne = (order) => {
    return db.query({
        text: `SELECT DISTINCT 
        (SELECT SUM(p.price * o.quantity) as subTotal FROM tbl_orders o JOIN tbl_products p ON o.product_id = p.product_id WHERE o.order_id = $1), paid_at, delivered_at, order_id, created_at, payment_email_address shipping_address, shipping_city, shipping_postal_code, shipping_country FROM tbl_orders o JOIN tbl_products p ON o.product_id = p.product_id WHERE o.user_id = $2 AND o.order_id = $3 LIMIT 1`,
        values: [order.order_id,order.user_id, order.order_id]
    })
}

const getAllOrdersDetailsByOrderIdAndUserId = (order) => {
    return db.query({
        text: `SELECT p.name,p.image,p.price, o.quantity, o.is_paid, o.is_delivered,o.paid_at, o.delivered_at, o.order_id, o.created_at, o.payment_email_address, o.shipping_address,o.payment_method, o.shipping_city, o.shipping_postal_code, o.shipping_country FROM tbl_orders o JOIN tbl_products p ON o.product_id = p.product_id 
        WHERE o.user_id = $1 AND o.order_id = $2`,
        values: [order.user_id,order.order_id]
    })
}

const findOrderByOrder_id = (order_id) => {
    return db.query({
        text: `SELECT * FROM tbl_orders WHERE order_id = $1`,
        values: [order_id]
    })
}

const updateOrderToPaidByOrder_id = (order_id) => {
    return db.query({
        text: `UPDATE tbl_orders SET is_paid = TRUE, paid_at = NOW() WHERE order_id = $1 returning *`,
        values: [order_id]
    });
}

const getOrderWithTotalAmountByOrderId = (order_id) => db.query(
    {text: `SELECT o.order_id, CONCAT(u.firstname, ' ' ,u.lastname) as name,o.created_at,
            (SELECT SUM(p.price * o.quantity) as subTotal FROM tbl_orders o JOIN tbl_products p ON o.product_id = p.product_id 
            WHERE o.order_id = $1),
            o.is_paid, o.is_delivered
            FROM tbl_orders o 
            INNER JOIN tbl_products p ON o.product_id = p.product_id
            INNER JOIN tbl_users u on o.user_id = u.user_id
            WHERE order_id = $1
            LIMIT 1`, 
    values: [order_id]
    })


const getAllOrderIdDistinctively = () => db.query(`SELECT DISTINCT order_id FROM tbl_orders`);

const getOrdersByOrderId = (order_id) => {
    return db.query({
        text: `SELECT CONCAT(u.firstname, ' ', u.lastname) as fullname, p.product_id, p.name,p.image,p.price, 
        o.quantity, o.is_paid, o.is_delivered,o.paid_at, 
        o.delivered_at, o.order_id, o.created_at, o.payment_email_address, 
        o.shipping_address,o.payment_method, o.shipping_city, 
        o.shipping_postal_code, o.shipping_country 
        FROM tbl_orders o 
        JOIN tbl_products p ON o.product_id = p.product_id 
        JOIN tbl_users u ON o.user_id = u.user_id
        WHERE o.order_id = $1`,
        values: [order_id]
    })
}

const updateOrderDeliveredByOrderId = (order_id) => {
    return db.query({
        text: `UPDATE tbl_orders SET is_delivered = true, delivered_at = NOW() WHERE order_id = $1`,
        values:[order_id]
    })
}

module.exports = {
    addOrderItem, getOrderItemsByUserId, 
    getOrderDetailsByOrderIdAndUserId_limitOne, 
    getAllOrdersDetailsByOrderIdAndUserId,
    findOrderByOrder_id,
    updateOrderToPaidByOrder_id,
    getOrderWithTotalAmountByOrderId,
    getAllOrderIdDistinctively,
    getOrdersByOrderId,
    updateOrderDeliveredByOrderId
}

