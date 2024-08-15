// backend/controllers/GoalControllers.mjs
import Goal from "../models/Goal.mjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { notifyUser } from "../src/websocket-server.mjs";

dotenv.config();

const Access_Token_Secret_Key = process.env.SECRET_key;

export const createGoal = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Authorization token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, Access_Token_Secret_Key);
  } catch (error) {
    return res.status(403).send("Invalid authorization token");
  }

  const { userId } = decoded;
  const { name, targetAmount, currentAmount, description } = req.body;

  if (!name || !targetAmount || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newGoal = new Goal({
      userId,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      description,
    });
    const savedGoal = await newGoal.save();

    // Send notification when goal is created
    notifyUser(userId, `Goal ${name} has been created!`);

    res.status(201).json({ goal: savedGoal });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGoal = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, Access_Token_Secret_Key);
  } catch (error) {
    return res.status(403).send("Invalid authorization token");
  }

  const { id } = req.params;
  const { amount } = req.body;

  try {
    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    if (goal.userId.toString() !== decoded.userId) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    if (goal.currentAmount + amount > goal.targetAmount) {
      return res.status(400).json({ error: "Exceeds target amount" });
    }

    goal.currentAmount += amount;
    goal.updatedAt = Date.now();
    const updatedGoal = await goal.save();

    // Send notification when goal reaches 80% or 100%
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    if (progress >= 80 && progress < 100) {
      notifyUser(goal.userId, `Goal ${goal.name} is 80% complete!`);
    } else if (progress >= 100) {
      notifyUser(
        goal.userId,
        `Congratulations! Goal ${goal.name} is complete!`
      );
    }

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update goal" });
  }
};

export const deleteGoal = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, Access_Token_Secret_Key);
  } catch (error) {
    return res.status(403).json({ error: "Invalid authorization token" });
  }

  const { id } = req.params;

  try {
    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    if (goal.userId.toString() !== decoded.userId) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    await goal.deleteOne();
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
};
