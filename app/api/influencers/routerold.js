const express = require('express');
const router = express.Router();
const influencerController = require('../controllers/influencerController');
const { authenticate } = require('../middleware/auth');

// Search influencers
router.get('/search', influencerController.searchInfluencers);

// Get influencer by ID
router.get('/:id', influencerController.getInfluencerById);

// Get top influencers
router.get('/top/:limit?', influencerController.getTopInfluencers);

// Update influencer profile (authenticated)
router.put('/me', authenticate, influencerController.updateInfluencerProfile);

// Add social media account
router.post('/me/social', authenticate, influencerController.addSocialMedia);

// Update social media account
router.put('/me/social/:id', authenticate, influencerController.updateSocialMedia);

// Delete social media account
router.delete('/me/social/:id', authenticate, influencerController.deleteSocialMedia);

// Add portfolio item
router.post('/me/portfolio', authenticate, influencerController.addPortfolioItem);

// Update portfolio item
router.put('/me/portfolio/:id', authenticate, influencerController.updatePortfolioItem);

// Delete portfolio item
router.delete('/me/portfolio/:id', authenticate, influencerController.deletePortfolioItem);

module.exports = router;