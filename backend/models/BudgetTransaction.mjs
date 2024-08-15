// models/BudgetTransaction.mjs
import mongoose from "mongoose";

const budgetTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    required: true,
  },
  budgetName: { type: String, required: true },
  budgetDescription: { type: String, required: true },
  amountUsed: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const BudgetTransaction = mongoose.model(
  "BudgetTransaction",
  budgetTransactionSchema
);
export default BudgetTransaction;
