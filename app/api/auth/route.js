const express = require('express');
const router = express.Router();
const authController = require('@/controllers/authController');

const { validateRegister, validateLogin } = require('../validators/authValidator');

// Register new user
router.post('/register', validateRegister, authController.register);

// Login user
router.post('/login', authController.login);

// Verify email
router.get('/verify/:token', authController.verifyEmail);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password/:token', authController.resetPassword);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

module.exports = router;