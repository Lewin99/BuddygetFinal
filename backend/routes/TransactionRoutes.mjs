import express from "express";
import { assignBudget } from "../controllers/TransactionControllers.mjs";
import {
  fetchAndSaveTransactions,
  getTransactions,
  getTransactionsByBudget,
} from "../controllers/TransactionControllers.mjs";

const Transactionrouters = express.Router();

Transactionrouters.post("/FetchandSaveTransactions", fetchAndSaveTransactions);
Transactionrouters.post("/GetTransactions", getTransactions);
Transactionrouters.post("/AssignBudget/:transactionId", assignBudget);
Transactionrouters.get(
  "/GetTransactionsByBudget/:budgetId",
  getTransactionsByBudget
);

export default Transactionrouters;
