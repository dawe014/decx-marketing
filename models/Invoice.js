import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  invoiceId: String,
  date: String,
  amount: String,
  status: String,
});

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);
