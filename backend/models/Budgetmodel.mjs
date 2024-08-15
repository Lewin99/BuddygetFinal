// models/BudgetModel.mjs
import mongoose from "mongoose";

const { Schema } = mongoose;

const budgetSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Budget name is required"],
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  allocatedAmount: {
    type: Number,
    required: [true, "Allocated amount is required"],
  },
  actualSpending: {
    type: Number,
    default: 0,
  },
});

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);

export default Budget;
