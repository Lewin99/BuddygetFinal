// backend/controllers/TransactionControllers.mjs
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import BudgetTransaction from "../models/BudgetTransaction.mjs";
import FinancialGoalTransaction from "../models/FinancialGoalTransaction.mjs";

dotenv.config();

const Access_Token_Secret_Key = process.env.SECRET_key;

const verifyToken = (token) => {
  if (!token) {
    throw new Error("Authorization token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, Access_Token_Secret_Key);
  } catch (error) {
    throw new Error("Invalid authorization token");
  }
  return decoded;
};

export const getBudgetTransactions = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const { userId } = verifyToken(token);

    const budgetTransactions = await BudgetTransaction.find({ userId });
    res.status(200).json({ budgetTransactions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getFinancialGoalTransactions = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const { userId } = verifyToken(token);

    const financialGoalTransactions = await FinancialGoalTransaction.find({
      userId,
    });
    res.status(200).json({ financialGoalTransactions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
