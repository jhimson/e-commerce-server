const express = require('express')
const Router = express.Router();
const {protect, isAdmin} = require('../middleware/authMiddleware')

const {
    addNewOrderItem,
    getOrdersById,
    getOrderDetailsById,
    getOrdersDetailsByOrderId,
    updateOrderToPaid,
    getOrderDetailsWithTotal,
    getDistinctOrderIds,
    getUserOrdersById,
    updateOrderDelivered
} = require('../controllers/orderController')

Router.route('/').post(protect, addNewOrderItem)
Router.route('/orderDetails',).post(protect, getOrderDetailsById)
Router.route('/distinct').get(protect, getDistinctOrderIds)
Router.route('/').get(protect, getOrdersById)
Router.route('/:id').get(protect, getOrdersDetailsByOrderId)
Router.route('/:id/all').get(protect, getUserOrdersById)
Router.route('/:id/orderDetails').get(protect, isAdmin, getOrderDetailsWithTotal)
Router.route('/:id/pay').put(protect, updateOrderToPaid)
Router.route('/:id/deliver').put(protect, isAdmin, updateOrderDelivered)



module.exports = Router; 