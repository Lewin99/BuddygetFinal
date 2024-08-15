// controllers/modelLoader.js
import joblib from "joblib";

let model;

export const loadModel = async () => {
  if (!model) {
    model = joblib.load("gradient_boosting_model.pkl");
  }
  return model;
};
