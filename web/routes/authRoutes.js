const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { forwardAuthenticated } = require('../middleware/auth');

// Register View
router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register', { title: 'Register' });
});

// Register Handle
router.post('/register', authController.registerUser);

// Login View
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login', { title: 'Login' });
});

// Login Handle
router.post('/login', authController.loginUser);

// Logout Handle
router.get('/logout', authController.logoutUser);

module.exports = router;
