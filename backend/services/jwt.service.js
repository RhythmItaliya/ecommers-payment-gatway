const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateAccessToken = (payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

module.exports = { generateAccessToken, verifyAccessToken };
