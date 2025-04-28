// models/PricingPlan.js

import mongoose from "mongoose";

const PricingPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["single-language", "multi-language", "basic", "standard", "premium"],
    unique: true,
  },
  price: {
    type: Number, // In ETB
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  recommended: {
    type: Boolean,
    default: false,
  },
  postFrequency: {
    type: String, // e.g., 'Weekly', 'Bi-Weekly'
  },
});

const PricingPlan =
  mongoose.models.PricingPlan ||
  mongoose.model("PricingPlan", PricingPlanSchema);

export default PricingPlan;
