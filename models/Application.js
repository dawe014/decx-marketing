const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  influencer: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer" },
  title: String, // Optional: may be set from campaign or user input
  proposal: String, // This matches the "Cover Letter" field
  quote: Number, // This matches "Your Rate ($)"
  portfolioLinks: [String], // New field to store multiple links
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
