// routes/TransactionRoutes.mjs
import express from "express";
import {
  getBudgetTransactions,
  getFinancialGoalTransactions,
} from "../controllers/finbudTransactionController.mjs";

const finbudrouter = express.Router();

finbudrouter.get(
  "/BudgetTransactions/GetBudgetTransactions",
  getBudgetTransactions
);
finbudrouter.get(
  "/FinancialGoalTransactions/GetFinancialGoalTransactions",
  getFinancialGoalTransactions
);

export default finbudrouter;
