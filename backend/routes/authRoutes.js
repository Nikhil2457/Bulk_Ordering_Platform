// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser ,getUserInfo} = require('../controllers/authController');
const {authMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

// Register user
router.post('/signup', registerUser);

// Login user
router.post('/login', loginUser);

router.get('/user',authMiddleware, getUserInfo);


module.exports = router;
console.log('registerUser:', registerUser);
console.log('loginUser:', loginUser);
