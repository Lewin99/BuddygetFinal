import jwt from "jsonwebtoken";
import client from "../src/Plaid_client.mjs";
import UserAccount from "../models/UserAccount.mjs";
import Transaction from "../models/TransactionModel.mjs";
import Budget from "../models/Budgetmodel.mjs"; // Ensure this is the only import for Budget model

// Fetch and Save Transactions from Plaid
export const fetchAndSaveTransactions = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_key);
  } catch (error) {
    return res.status(403).send("Invalid authorization token");
  }

  const userId = decoded.userId;

  try {
    const userAccount = await UserAccount.findOne({ userId });

    if (!userAccount) {
      return res.status(404).send("User account not found");
    }

    const { accessToken } = userAccount;

    // Define the date range for transactions
    const startDate = "2020-01-01"; // Adjust as necessary
    const endDate = new Date().toISOString().split("T")[0]; // Current date

    // Fetch transactions from Plaid
    const response = await client.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    });

    const transactions = response.data.transactions;

    // Save transactions to the database
    for (const transaction of transactions) {
      const transactionData = new Transaction({
        userId,
        accountId: transaction.account_id,
        transactionId: transaction.transaction_id,
        amount: transaction.amount,
        date: transaction.date,
        name: transaction.name,
        category: transaction.category,
        pending: transaction.pending,
        transactionType: transaction.transaction_type,
        location: {
          address: transaction.location.address,
          city: transaction.location.city,
          region: transaction.location.region,
          postalCode: transaction.location.postal_code,
          country: transaction.location.country,
        },
        merchantName: transaction.merchant_name,
        paymentChannel: transaction.payment_channel,
        isoCurrencyCode: transaction.iso_currency_code,
        unofficialCurrencyCode: transaction.unofficial_currency_code,
      });

      await transactionData.save();
    }

    res.json({ status: "success", transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get Transactions from the Database
export const getTransactions = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_key);
  } catch (error) {
    return res.status(403).send("Invalid authorization token");
  }

  const userId = decoded.userId;

  try {
    const transactions = await Transaction.find({ userId }).sort({ date: -1 }); // Sort by date descending
    res.json({ status: "success", transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Controller Function to Reassign Budget and Update Spending
export const assignBudget = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { transactionId } = req.params;
  const { budgetId } = req.body;

  if (!token) {
    return res.status(401).send("Authorization token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_key);
  } catch (error) {
    return res.status(403).send("Invalid authorization token");
  }

  const userId = decoded.userId;

  try {
    // Find the transaction by ID and ensure it belongs to the user
    const transaction = await Transaction.findOne({
      transactionId,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Check if the transaction was previously assigned to another budget
    if (transaction.budgetId && transaction.budgetId !== budgetId) {
      const oldBudget = await Budget.findOne({
        _id: transaction.budgetId,
        userId,
      });
      if (oldBudget) {
        oldBudget.actualSpending -= Math.abs(transaction.amount);
        await oldBudget.save();
      }
    }

    // Find the new budget by ID and ensure it belongs to the user
    const newBudget = await Budget.findOne({ _id: budgetId, userId });

    if (!newBudget) {
      return res.status(404).json({ error: "New budget not found" });
    }

    // Assign the new budget to the transaction
    transaction.budgetId = budgetId;
    await transaction.save();

    // Update the actual spending in the new budget
    newBudget.actualSpending += Math.abs(transaction.amount);
    await newBudget.save();

    res.status(200).json({ status: "success", transaction });
  } catch (error) {
    console.error("Error reassigning budget:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Transactions by Budget ID
export const getTransactionsByBudget = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { budgetId } = req.params;

  if (!token) {
    return res.status(401).send("Authorization token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_key);
  } catch (error) {
    return res.status(403).send("Invalid authorization token");
  }

  const userId = decoded.userId;

  try {
    // Verify that the budget belongs to the user
    const budget = await Budget.findOne({ _id: budgetId, userId });

    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // Find all transactions associated with the budget
    const transactions = await Transaction.find({ budgetId });
    return res.status(200).json({ status: "success", transactions });
  } catch (error) {
    console.error("Error fetching transactions by budget:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
