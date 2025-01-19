const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
    
    const token = req.cookies[process.env.COOKIE_NAME] || req.headers.authorization?.split(" ")[1];
    console.log(token);
    console.log("t2");
    if (!token) {
        console.log(token);
        return res.status(401).json({ message: 'Access Denied. No token provided.' });}

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) return res.status(404).json({ message: 'User not found.' });
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

exports.isAuthorized = (req, res, next) => {
    console.log("authorized");
    if (req.user.role !== 'Admin' && req.user.role !== 'Core Team') {
        return res.status(403).json({ message: 'Access Denied. Admins or Coordinators only.' });
    }
    next();
};

