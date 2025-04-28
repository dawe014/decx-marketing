const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  logo: String,
  industry: {
    type: String,
    enum: [
      "fashion",
      "beauty",
      "tech",
      "food",
      "health",
      "finance",
      "education",
      "entertainment",
      "other",
    ],
  },
  website: String,
  companySize: {
    type: String,
    enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
  },
  description: String,
  contactPerson: {
    name: String,
    position: String,
    phone: String,
  },
  subscription: {
    type: {
      type: String,
      enum: ["free", "basic", "premium", "enterprise"],
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["active", "expired", "canceled"],
    },
  },
  paymentMethods: [
    {
      type: {
        type: String,
        enum: ["credit_card", "paypal", "bank_transfer"],
      },
      details: mongoose.Schema.Types.Mixed,
      isDefault: Boolean,
    },
  ],
  campaigns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
  ],
});

const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
module.exports = Brand;
