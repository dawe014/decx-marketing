const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateProfileUpdate } = require('../validators/userValidator');

// Get current user profile
router.get('/me', authenticate, userController.getMyProfile);

// Update profile
router.put('/me', authenticate, validateProfileUpdate, userController.updateProfile);

// Upload profile photo
router.post('/me/photo', authenticate, userController.uploadProfilePhoto);

// Get user by ID
router.get('/:id', userController.getUserById);

// Admin routes
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.put('/:id/verify', authenticate, authorize('admin'), userController.verifyUser);
router.put('/:id/status', authenticate, authorize('admin'), userController.updateUserStatus);

module.exports = router;