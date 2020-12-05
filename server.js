require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const api = require('./api')
const path = require('path')
const {notFound, errorHandler} =  require('./middleware/errorMiddleware')

const PORT = process.env.PORT || 5000;
const app = express();

// * Setup built in express body-parser
// ! NOTE: Always setup the body-parser on top of the routes.
app.use(express.json());

// * Setup Cors Middleware (Cross-Origin Resource Sharing) allow all '*'
app.use(cors('*'));

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

//* Routes
app.use('/api/v1', api);

//* Config Route
app.get('/api/v1/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))


// if(process.env.NODE_ENV === 'production'){
//   app.use(express.static(path.join(__dirname, '/frontend/build')))

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
//   })
// }else{
//   app.get('/', (req, res) => {
//     res.send('API is running...')
//   })
// }

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


//* Error handle middlewares
app.use(notFound) 
app.use(errorHandler)

app.listen(PORT, async() => {
    try{
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

    }catch(err){
      console.log(err)
    }
})