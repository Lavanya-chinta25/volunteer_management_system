/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
};

// Add a new user (only for admins)
exports.addUser = async (req, res) => {
    const { branch, year, phone, club, role, photo, creditScore } = req.body;
    try {
        const tzId = `TZ25V${Math.floor(100 + Math.random() * 900)}`;
        const user = new User({ tzId, branch, year, phone, club, role, photo, creditScore });
        await user.save();
        res.status(201).json({ message: 'User added successfully', tzId });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user and set JWT in cookie
exports.loginUser = async (req, res) => {
    const { tzId } = req.body;
    try {
        const user = await User.findOne({ tzId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate a token
        const token = generateToken(user._id);

        // Set token in a cookie
        res.cookie(process.env.COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user by clearing the cookie
exports.logoutUser = (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.status(200).json({ message: 'Logged out successfully' });
};

// Upload photo
exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        // Update user's photo field in the database
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { photo: req.file.path },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Photo uploaded successfully', photo: user.photo });
    } catch (error) {
        res.status(500).json({ message: 'Server error now' });
    }
};
//password added