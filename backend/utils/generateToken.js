const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) => {
    console.log("My Secret is:", process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = { generateToken }