const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const { authenticate } = require("../middleware/auth");

// Get brand by ID
router.get("/:id", brandController.getBrandById);

// Update brand profile (authenticated)
router.put("/me", authenticate, brandController.updateBrandProfile);

// Get brand campaigns
router.get("/:id/campaigns", brandController.getBrandCampaigns);

// Subscribe/upgrade plan
router.post("/me/subscribe", authenticate, brandController.subscribe);

// Cancel subscription
router.post(
  "/me/subscribe/cancel",
  authenticate,
  brandController.cancelSubscription
);

// Add payment method
router.post(
  "/me/payment-methods",
  authenticate,
  brandController.addPaymentMethod
);

// Update payment method
router.put(
  "/me/payment-methods/:id",
  authenticate,
  brandController.updatePaymentMethod
);

// Delete payment method
router.delete(
  "/me/payment-methods/:id",
  authenticate,
  brandController.deletePaymentMethod
);

module.exports = router;
