import express from "express";
import {
  getBudgets,
  postBudget,
  getBudgetById,
  updateBudgetById,
  deleteBudgetById,
  updateActualSpending,
  getTotalExpenses,
} from "../controllers/BudgetController.mjs";
import { getAccountBalances } from "../controllers/BudgetController.mjs";

const Budgetrouters = express.Router();

Budgetrouters.post("/CreateBudget", postBudget);
Budgetrouters.get("/GetBudgets", getBudgets);
Budgetrouters.get("/GetBudget/:id", getBudgetById);
Budgetrouters.put("/UpdateBudget/:id", updateBudgetById);
Budgetrouters.delete("/DeleteBudget/:id", deleteBudgetById);
Budgetrouters.put("/UpdateActualSpending/:id", updateActualSpending);
Budgetrouters.get("/GetTotalExpenses", getTotalExpenses);
Budgetrouters.get("/GetAccountBalances", getAccountBalances);

export default Budgetrouters;
