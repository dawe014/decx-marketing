// Import required modules

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  influencer: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer" },
  title: String,
  proposal: String,
  quote: Number,
  status: {
    type: String,
    enum: ["pending", "shortlisted", "rejected", "hired", "completed"],
    default: "pending",
  },
  appliedAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
