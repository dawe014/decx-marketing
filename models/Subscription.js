import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "basic", "pro", "enterprise"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "past_due", "canceled", "expired"],
      default: "active",
    },
    billingCycle: {
      type: String,
      enum: ["monthly"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    nextBillingDate: Date,
    paymentMethod: {
      type: String,
      enum: ["card", "bank_transfer", "paypal"],
      required: true,
    },
    paymentMethodId: String, // Reference to payment processor
    features: {
      campaigns: Number,
      collaborators: Number,
      analytics: Boolean,
      premiumSupport: Boolean,
      customContracts: Boolean,
    },
    cancellation: {
      requestedAt: Date,
      reason: String,
      willEndAt: Date,
    },
    history: [
      {
        date: Date,
        event: String,
        data: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriptionSchema.index({ brand: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ nextBillingDate: 1 });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
