const Campaign = require('../models/Campaign');
const User = require('../models/User');

exports.createCampaign = async (req, res) => {
  try {
    const brandId = req.user._id;
    
    // Check if brand has active subscription
    const brand = await User.findById(brandId);
    if (!brand || brand.role !== 'brand') {
      return res.status(403).json({ message: 'Only brands can create campaigns' });
    }

    if (brand.subscription.status !== 'active') {
      return res.status(403).json({ message: 'Active subscription required to create campaigns' });
    }

    const campaignData = {
      ...req.body,
      brand: brandId,
      status: 'active'
    };

    const campaign = new Campaign(campaignData);
    await campaign.save();

    // Add campaign to brand's campaigns array
    brand.campaigns.push(campaign._id);
    await brand.save();

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create campaign', error: error.message });
  }
};

exports.applyToCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const influencerId = req.user._id;
    const { proposal, quote } = req.body;

    // Check if influencer
    const influencer = await User.findById(influencerId);
    if (!influencer || influencer.role !== 'influencer') {
      return res.status(403).json({ message: 'Only influencers can apply to campaigns' });
    }

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if already applied
    const existingApplication = campaign.applications.find(app => 
      app.influencer.toString() === influencerId.toString()
    );
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this campaign' });
    }

    // Add application
    campaign.applications.push({
      influencer: influencerId,
      proposal,
      quote,
      status: 'pending'
    });

    await campaign.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply to campaign', error: error.message });
  }
};

// Other campaign methods (getCampaigns, getCampaignById, updateCampaign, deleteCampaign, etc.)...