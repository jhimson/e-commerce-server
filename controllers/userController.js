const asyncHandler =  require('express-async-handler')
const  { 
    fetchUsers,
    fetchUserById,
    addUser, 
    findUser, 
    updateUser,
    deleteUserById,
    findUserById
} = require('../db/models/userModel');
const { checkPassword, generateToken, hashPassword } = require('../utils/auth');
const bcrypt = require('bcryptjs');
const { isAdmin } = require('../middleware/authMiddleware');
const salt = bcrypt.genSaltSync(10);


//? @Description    insert users
//? @Route          POST /api/v1/users
//? @Access         Private
const registerUser = asyncHandler(async(req, res) => {
    const userExists = await findUser(req.body.username);
    if(userExists.rowCount){
        res.status(400)
        throw new Error('Username already exists')
    }

    const newUser = await addUser(req.body);
    const {rows} = newUser;
    const { user_id, firstname, lastname, email, username,is_admin } = rows[0]
    if(newUser.rowCount){
        res.status(201).json({user_id, firstname, lastname, email, username,is_admin, token: generateToken(user_id)})
    }else{
        res.status(400);
        throw new Error('Invalid user data')
    }
})


//? @Description    Fetch all users
//? @Route          GET /api/v1/users
//? @Access         Private/Admin
const getUsers = asyncHandler(async(req, res) => {
    const {rows} = await fetchUsers();
    if(rows){
        res.status(200).json(rows)
    }else{
        res.status(404);
        throw new Error('No users found in the database')
    }
})

//? @Description    Fetch user profile
//? @Route          GET /api/v1/users/profile
//? @Access         private
const getUserProfile = asyncHandler(async(req, res) => {
    const {rowCount, rows} = await fetchUserById(req.user.user_id);
    const {user_id,firstname, lastname, email,username, is_admin} = rows[0];

    if(rowCount){
        res.status(200).json({
            user_id,
            firstname,
            lastname,
            username,
            email,
            is_admin 
        })
    }else{
        res.status(404);
        throw new Error('User not found!')
    }
    
})

//? @Description    Update user profile
//? @Route          PUT /api/v1/users/profile
//? @Access         Private
const updateUserProfile = asyncHandler(async(req, res) => {
    let {rowCount, rows} = await fetchUserById(req.user.user_id);
    req.body.user_id = req.user.user_id;
    if(rowCount){
    let {firstname, lastname, email,username, password} = rows[0];
        rows[0].firstname = req.body.firstname || firstname,
        rows[0].lastname = req.body.lastname || lastname,
        rows[0].email = req.body.email || email,
        rows[0].username = req.body.username || username,
        rows[0].password = password

        if(req.body.password !== ''){
            rows[0].password = bcrypt.hashSync(req.body.password, salt)
        }
        
        const updatedUser = await updateUser(rows[0])
        res.json({
            user_id: updatedUser.rows[0].user_id,
            firstname: updatedUser.rows[0].firstname,
            lastname: updatedUser.rows[0].lastname,
            email: updatedUser.rows[0].email,
            username: updatedUser.rows[0].username,
            token: generateToken(updatedUser.rows[0].user_id)
        })
    
    }else{
        res.status(404);
        throw new Error('User not found!')
    }
    
})

const authUser = asyncHandler(async(req, res) => {
    const {username, password} = req.body;
    const {rowCount, rows} = await findUser(username);
    const userData = rows[0]
    if(rowCount && bcrypt.compareSync(password, userData.password)){
        res.json({
            user_id: userData.user_id,
            name: userData.name,
            email: userData.email,
            isAdmin: userData.is_admin,
            token: generateToken(userData.user_id) 
        })
    }else{
        res.status(401)
        throw new Error('Invalid Username/Password')
    }
    
})

//? @Description    DELETE user by user_id
//? @Route          DELETE /api/v1/users/:id/
//? @Access         Private/Admin
const deleteUser = asyncHandler(async(req, res) => {
    const user_id = req.params.id;
    const {rowCount, rows} = await deleteUserById(user_id);
    if(rowCount){
        res.json({Message: `Successfully deleted user`,rows})
    }else{
        res.status(404);
        throw new Error('User not found!')
    }
})

//? @Description    GET user by user_id
//? @Route          GET /api/v1/users/:id/
//? @Access         Private/Admin
const getUserById = asyncHandler(async(req, res, next) => {
    const user_id = req.params.id;
    
    const {rowCount, rows} = await findUserById(user_id);
    if(rowCount){
        res.json({user: rows[0]})
    }else{
        let error = new Error('User not found!');
        error.status = 404;
        next(error);
    }
})

//? @Description    Update user
//? @Route          PUT /api/v1/users/:id
//? @Access         Private/Admin
const updateUserById = asyncHandler(async(req, res, next) => {
    let {rowCount, rows} = await fetchUserById(req.params.id);

    if(rowCount){
        let {firstname, lastname, email,username, is_admin} = rows[0];
            rows[0].firstname = req.body.firstname || firstname,
            rows[0].lastname = req.body.lastname || lastname,
            rows[0].email = req.body.email || email,
            rows[0].username = req.body.username || username,
            rows[0].is_admin = req.body.is_admin
            const updatedUser = await updateUser(rows[0])
            res.json({
                user_id: updatedUser.rows[0].user_id,
                firstname: updatedUser.rows[0].firstname,
                lastname: updatedUser.rows[0].lastname,
                email: updatedUser.rows[0].email,
                username: updatedUser.rows[0].username,
                is_admin: updatedUser.rows[0].is_admin
            })
        
    }else{
        let error = new Error('User not found!');
        error.status = 404;
        next(error);
    }
})

module.exports = {
    getUsers,
    getUserProfile,
    registerUser,
    authUser,
    updateUserProfile,
    deleteUser,
    getUserById,
    updateUserById
}


