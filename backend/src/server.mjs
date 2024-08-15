import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import usersrouter from "../routes/Userroutes.mjs";
import plaidrouters from "../routes/Plaidroutes.mjs";
import Budgetrouters from "../routes/BudgetRoutes.mjs";
import cors from "cors";
import Transactionrouters from "../routes/TransactionRoutes.mjs";
import Goalrouter from "../routes/GoalsRoutes.mjs";
import { createServer } from "http";
import { handleUpgrade } from "./websocket-server.mjs";
import finbudrouter from "../routes/finbudTransactionRoutes.mjs";
import predictionRouter from "../routes/predictionRoutes.mjs";

dotenv.config();

const conString = process.env.Db_connect;

(async () => {
  try {
    await mongoose.connect(conString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection successful");
  } catch (error) {
    console.error("Connection error:", error);
  }
})();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5500;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/users", usersrouter);
app.use("/", plaidrouters);
app.use("/Budget", Budgetrouters);
app.use("/Transactions", Transactionrouters);
app.use("/finbudTransactions", finbudrouter);
app.use("/Goals", Goalrouter);
app.use("/predictions", predictionRouter); // Use the new route

const server = createServer(app);

handleUpgrade(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
