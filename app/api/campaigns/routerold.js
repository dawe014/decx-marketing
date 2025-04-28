const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { authenticate } = require('../middleware/auth');
const { validateCampaign } = require('../validators/campaignValidator');

// Get all campaigns (filtered)
router.get('/', campaignController.getCampaigns);

// Create new campaign
router.post('/', authenticate, validateCampaign, campaignController.createCampaign);

// Get campaign by ID
router.get('/:id', campaignController.getCampaignById);

// Update campaign
router.put('/:id', authenticate, campaignController.updateCampaign);

// Delete campaign
router.delete('/:id', authenticate, campaignController.deleteCampaign);

// Apply to campaign (influencer)
router.post('/:id/apply', authenticate, campaignController.applyToCampaign);

// Manage applications (brand)
router.put('/:id/applications/:applicationId', authenticate, campaignController.updateApplicationStatus);

// Manage hired influencers
router.put('/:id/hired/:influencerId', authenticate, campaignController.updateHiredInfluencer);

// Submit deliverable (influencer)
router.post('/:id/deliverables', authenticate, campaignController.submitDeliverable);

// Review deliverable (brand)
router.put('/:id/deliverables/:deliverableId', authenticate, campaignController.reviewDeliverable);

module.exports = router;