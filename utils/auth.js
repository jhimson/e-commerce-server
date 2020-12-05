
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const checkPassword = async (password, hashedPassword) => {
    let isMatch = bcrypt.compareSync(password, hashedPassword);
    return isMatch;
  };

  const hashPassword = async password => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
   return hash;
  };

  const generateToken = (user_id) => {
    return jwt.sign({user_id}, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })
  }

  module.exports = {
      checkPassword,
      hashPassword,
      generateToken
  }

  