/* eslint-disable no-undef */
const express = require('express');
const { addUser, loginUser, logoutUser, uploadPhoto } = require('../controllers/authController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/add', authenticate, isAdmin, addUser); // Only admins can add users
router.post('/login', loginUser);
router.post('/logout', authenticate, logoutUser); // Logout route
router.post('/upload-photo', authenticate, upload.single('photo'), uploadPhoto); // Upload photo

module.exports = router;
