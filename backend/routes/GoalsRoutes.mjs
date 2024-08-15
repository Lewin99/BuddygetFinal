import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  getTotalSavings,
} from "../controllers/GoalControllers.mjs";

const Goalrouter = express.Router();

Goalrouter.post("/CreateGoal", createGoal);
Goalrouter.get("/GetGoals", getGoals);
Goalrouter.put("/UpdateGoal/:id", updateGoal);
Goalrouter.delete("/DeleteGoal/:id", deleteGoal);
Goalrouter.get("/GetTotalSavings", getTotalSavings);

export default Goalrouter;
