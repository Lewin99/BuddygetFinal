import express from "express";
import { predictFutureSpending } from "../controllers/PredictionController.mjs";

const predictionRouter = express.Router();

// Route to predict future spending
predictionRouter.post("/predictFutureSpending", predictFutureSpending);

export default predictionRouter;
