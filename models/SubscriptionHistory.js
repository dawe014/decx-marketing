import mongoose from "mongoose";

const subscriptionHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  oldPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
  },
  newPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

const SubscriptionHistory =
  mongoose.models.SubscriptionHistory ||
  mongoose.model("SubscriptionHistory", subscriptionHistorySchema);
export default SubscriptionHistory;
