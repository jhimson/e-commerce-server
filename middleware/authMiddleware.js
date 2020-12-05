const jwt = require('jsonwebtoken');
const asyncHandler =  require('express-async-handler')
const {fetchUserById} = require('../db/models/userModel')


const protect = asyncHandler(async(req, res, next) => {
    let token = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const {rows} = await fetchUserById(decoded.user_id);
            req.user = rows[0]
            next()
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed')
        }
    }

    if(!token){
        res.status(401);
        throw new Error('Not Authorized, token not found!')
    }
})

const isAdmin = (req, res, next) => {
    if(req.user && req.user.is_admin){
        next();
    }else{
        res.status(401);
        throw new Error('Not authorized as an Admin')
    }
}

module.exports = {
    protect,
    isAdmin
}