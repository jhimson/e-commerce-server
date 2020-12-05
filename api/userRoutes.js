const express = require('express')
const Router = express.Router();
const {protect, isAdmin} = require('../middleware/authMiddleware')
const {
    getUsers,
    getUserProfile, 
    registerUser, 
    authUser, 
    updateUserProfile,
    deleteUser,
    getUserById,
    updateUserById
} = require('../controllers/userController')

Router.post('/login', authUser)

Router
.route('/')
.post(registerUser)
.get(protect,isAdmin,getUsers)

Router
.route('/profile')
.get(protect, getUserProfile)
.put(protect, updateUserProfile)

Router
.route(`/:id`)
.delete(protect, isAdmin, deleteUser)
.get(protect, isAdmin, getUserById)
.put(protect, isAdmin, updateUserById)

module.exports = Router; 