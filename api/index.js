
const express = require('express')
const productRoutes =  require('./productRoutes')
const userRoutes = require('./userRoutes')
const orderRoutes = require('./orderRoutes')
const uploadRoutes = require('./uploadRoutes')
const reviewRoutes = require('./reviewRoutes')

const Router = express.Router();

Router.use('/products', productRoutes)
Router.use('/users', userRoutes)
Router.use('/orders', orderRoutes)
Router.use('/uploads', uploadRoutes)
Router.use('/reviews', reviewRoutes)


module.exports = Router;