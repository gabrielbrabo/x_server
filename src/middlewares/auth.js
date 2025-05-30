const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { promisify } = require('util');

module.exports = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token was not provided.' });
    }

    const [, token] = authHeader.split(' ');

    try {
        // Verifica o token
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        req.userId = decoded.id;

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};
