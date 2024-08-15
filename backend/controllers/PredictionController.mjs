import axios from "axios";
import jwt from "jsonwebtoken";
import Transaction from "../models/TransactionModel.mjs";

const calculateRollingAvg = (transactionHistory, windowSize = 3) => {
  if (transactionHistory.length < windowSize) {
    return 0;
  }
  const sum = transactionHistory
    .slice(-windowSize)
    .reduce((acc, trans) => acc + trans.amount, 0);
  return sum / windowSize;
};

const getPreviousAmount = (transactionHistory, lag) => {
  if (transactionHistory.length < lag) {
    return 0;
  }
  return transactionHistory[transactionHistory.length - lag].amount;
};

const categoryEncoding = {
  Groceries: 0,
  Rent: 1,
  Utilities: 2,
  Transportation: 3,
  Healthcare: 4,
  Entertainment: 5,
  Investment: 6,
  Salary: 7,
  "Food & Dining": 8,
  Travel: 9,
  // Add other categories as needed
};

const encodeCategory = (category) => {
  return categoryEncoding[category] || -1;
};

const prepareData = (transactions) => {
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  let transactionHistory = [];
  return transactions.map((transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day_of_week = date.getDay();
    const quarter = Math.floor((month - 1) / 3) + 1;
    const category_encoded = encodeCategory(transaction.category);
    const rolling_avg = calculateRollingAvg(transactionHistory);
    const lag_1 = getPreviousAmount(transactionHistory, 1);
    const lag_2 = getPreviousAmount(transactionHistory, 2);
    transactionHistory.push(transaction);
    return {
      month,
      year,
      day_of_week,
      quarter,
      rolling_avg,
      lag_1,
      lag_2,
      category_encoded,
      originalCategory: transaction.category,
      amount: transaction.amount, // Keep the amount to check for positive values
    };
  });
};

const FLASK_API_URL = "http://127.0.0.1:5000/predict";

export const predictFutureSpending = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(403).json({ error: "Invalid authorization token" });
    }

    const userId = decoded.userId;
    const transactions = await Transaction.find({ userId }).exec();

    if (!transactions.length) {
      return res
        .status(404)
        .json({ error: "No transactions found for this user." });
    }

    // Filter transactions with positive amounts
    const incomeTransactions = transactions.filter(
      (transaction) => transaction.amount > 0
    );

    const preparedData = prepareData(incomeTransactions);
    const featureData = preparedData.map((item) => [
      item.month,
      item.year,
      item.day_of_week,
      item.quarter,
      item.rolling_avg,
      item.lag_1,
      item.lag_2,
      item.category_encoded,
    ]);

    const response = await axios.post(FLASK_API_URL, {
      features: featureData,
    });

    const predictions = response.data;

    const mappedPredictions = predictions.map((predictedAmount, index) => ({
      Category: preparedData[index].originalCategory,
      PredictedAmount: predictedAmount,
    }));

    res.json({ predictions: mappedPredictions });
  } catch (error) {
    console.error("Error predicting future spending:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
