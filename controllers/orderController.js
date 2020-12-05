const asyncHandler =  require('express-async-handler')
const {
    addOrderItem,
    getOrderItemsByUserId, 
    getOrderDetailsByOrderIdAndUserId_limitOne,
    getAllOrdersDetailsByOrderIdAndUserId,
    findOrderByOrder_id,
    updateOrderToPaidByOrder_id,
    getOrderWithTotalAmountByOrderId,
    getAllOrderIdDistinctively,
    getOrdersByOrderId,
    updateOrderDeliveredByOrderId
} 
    = require('../db/models/orderModel')


//? @Description    Add new order
//? @Route          POST /api/v1/orders
//? @Access         Private
const addNewOrderItem = asyncHandler(async(req, res, next) => {
    const {rowCount, rows} = await addOrderItem(req.body);

    if(rowCount){
        res.status(201).json({Message: 'Successfully Added new order', rows})
    }else{
        let error = new Error('Failed to add new order!');
        error.status = 500;
        next(error);
    }
})

//? @Description    Get new orders
//? @Route          GET /api/v1/orders
//? @Access         Private
const getOrdersById = asyncHandler(async(req, res, next) => {
    const {user_id} = req.user;
    const {rowCount, rows} = await getOrderItemsByUserId(user_id);

    if(rowCount){
        res.status(200).json({Message: 'Successfully fetched order(s)', rows})
    }else{
        let error = new Error('No orders found in the database!');
        error.status = 404;
        next(error);
    }
})

//? @Description    FETCH order details
//? @Route          POST /api/v1/orders/orderDetails
//? @Access         Private
const getOrderDetailsById = asyncHandler(async(req, res, next) => {
    const {user_id, order_id} = req.body;
    const {rowCount, rows} = await getOrderDetailsByOrderIdAndUserId_limitOne({user_id, order_id});
    if(rowCount){
        res.status(200).json({Message: 'Successfully fetched order(s)', rows: rows[0]})
    }else{
        let error = new Error('Order not found!');
        error.status = 404;
        next(error);
    }
})

//? @Description    FETCH all orders details by order_id
//? @Route          GET /api/v1/orders/:id
//? @Access         Private
const getOrdersDetailsByOrderId = asyncHandler(async(req, res, next) => {
    const {user_id} = req.user;
    const order_id = req.params.id;
    const {rowCount, rows} = await getAllOrdersDetailsByOrderIdAndUserId({user_id, order_id});
    if(rowCount){
        res.status(200).json({Message: 'Successfully fetched order(s)', rows})
    }else{
        let error = new Error('Order not found!');
        error.status = 404;
        next(error);
    }
})

//? @Description    Update specific order to paid
//? @Route          PUT /api/v1/orders/:id/pay
//? @Access         Private
const updateOrderToPaid = asyncHandler(async(req, res, next) => {
    const order_id = req.params.id;
    const {rowCount, rows} = await findOrderByOrder_id(order_id);

    if(rowCount){
        const updatedOrder = await updateOrderToPaidByOrder_id(order_id);
        res.status(200).json({
            Message: 'Successfully paid order',
            order_id,
            data: updatedOrder.rows
        })
    }else{
        let error = new Error('Order not found!');
        error.status = 404;
        next(error);
    }

})

//? @Description    Fetch order details with total
//? @Route          GET /api/v1/orders/:id/orderDetails
//? @Access         Private/Admin
const getOrderDetailsWithTotal = asyncHandler(async(req, res, next) => {
    const order_id = req.params.id;

    const {rowCount, rows} = await getOrderWithTotalAmountByOrderId(order_id);
    
    if(rowCount){
        res.status(200).json({Message: 'Successfully fetch order', order: rows[0]})
    }else{
        let error = new Error('Order not found!');
        error.status = 404;
        next(error);
    }
})


//? @Description    Fetch order id distinctively
//? @Route          GET /api/v1/orders/distinct
//? @Access         Private/Admin
const getDistinctOrderIds = asyncHandler(async(req, res, next) => {
    const {rowCount, rows} = await getAllOrderIdDistinctively();
    if(rowCount){
        res.status(200).json({Message: 'Successfully fetched order ids', rows})
    }else{
        let error = new Error('No orders found!');
        error.status = 404;
        next(error);
    }
})


//? @Description    Fetch orders by order_id
//? @Route          GET /api/v1/orders/:id/all
//? @Access         Private/Admin
const getUserOrdersById = asyncHandler(async(req, res, next) => {
    const order_id = req.params.id;
    const {rowCount, rows} = await getOrdersByOrderId(order_id);

    if(rowCount){
        res.status(200).json({Message: 'Successfully Fetched orders', orders: rows})
    }else{  
        let error = new Error('No orders found!');
        error.status = 404;
        next(error);
    }
})

//? @Description    Fetch orders by order_id
//? @Route          PUT /api/v1/orders/:id/delivered
//? @Access         Private/Admin
const updateOrderDelivered = asyncHandler(async(req, res, next) => {
    const order_id = req.params.id;
    
    const {rowCount} = await updateOrderDeliveredByOrderId(order_id);
    if(rowCount){
        res.status(200).json({Message: 'Successfully Updated order as Delivered'})
    }else{
        let error = new Error('Order not found!');
        error.status = 404;
        next(error);
    }
})


module.exports = {
    addNewOrderItem,
    getOrdersById,
    getOrderDetailsById,
    getOrdersDetailsByOrderId,
    updateOrderToPaid,
    getOrderDetailsWithTotal,
    getDistinctOrderIds,
    getUserOrdersById,
    updateOrderDelivered
}