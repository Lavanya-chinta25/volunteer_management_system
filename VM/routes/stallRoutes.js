const express = require('express');
const { createStall, getStalls, updateStall, deleteStall } = require('../controllers/stallController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createStall);
router.get('/', authenticate, getStalls);
router.put('/:id', authenticate, updateStall);
router.delete('/:id', authenticate, deleteStall);

module.exports = router;
