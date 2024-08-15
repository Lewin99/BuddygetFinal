// models/FinancialGoalTransaction.mjs
import mongoose from "mongoose";

const financialGoalTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", required: true },
  goalName: { type: String, required: true },
  goalDescription: { type: String, required: true },
  amountAdded: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const FinancialGoalTransaction = mongoose.model(
  "FinancialGoalTransaction",
  financialGoalTransactionSchema
);
export default FinancialGoalTransaction;
