const db = require('../');
const {hashPassword, checkPassword} = require('../../utils/auth')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);


const fetchUsers = () => db.query(`SELECT * FROM tbl_users WHERE is_active = true`);

const fetchUserById = id => db.query({
    text: `SELECT * FROM tbl_users WHERE user_id = $1`,
    values: [id]
})

const addUser = async user => {
    const {user_id, firstname, lastname, email, username, password} = user;
    const hashedPassword = bcrypt.hashSync(password, salt)
    return db.query({
        text: `INSERT INTO tbl_users (user_id, firstname, lastname, email, username, password, is_active, is_admin, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, DEFAULT, DEFAULT, DEFAULT, DEFAULT) returning *`,
        values: [user_id, firstname, lastname, email, username, hashedPassword]
    })
    
}

const findUser = (username) => db.query({
    text: `SELECT * FROM tbl_users WHERE username = $1`,
    values: [username]
})


const updateUser = async userData => {
    const {firstname, lastname, email, username, password, user_id, is_admin} = userData;
    return db.query({
        text: `UPDATE tbl_users SET firstname = $1, lastname = $2, email = $3, username = $4, password = $5, is_admin = $6 WHERE user_id = $7 returning *`,
        values: [firstname, lastname, email, username, password, is_admin, user_id]
    })
}

const deleteUserById = user_id => {
    return db.query({
        text: `DELETE FROM tbl_users WHERE user_id = $1 returning *`,
        values: [user_id]
    })
} 

const findUserById = user_id => {
    return db.query({
        text:`SELECT * FROM tbl_users WHERE user_id = $1 LIMIT 1`,
        values: [user_id]
    })
}

module.exports = {
    fetchUsers,
    fetchUserById, 
    addUser, 
    findUser, 
    updateUser,
    deleteUserById,
    findUserById
}




