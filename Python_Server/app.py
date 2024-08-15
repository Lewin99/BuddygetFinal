from flask import Flask, request, jsonify
import pandas as pd
import pickle
import numpy as np

app = Flask(__name__)

# Load the trained model and the scaler
model = pickle.load(open('category_spending_model.pkl', 'rb'))
scaler = pickle.load(open('scaler.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json['features']
        # The order of columns should match the training data
        columns = ['month', 'year', 'day_of_week', 'quarter', 'rolling_avg', 'lag_1', 'lag_2', 'category_encoded']
        df = pd.DataFrame(data, columns=columns)

        # Apply scaling as done in training
        df_scaled = scaler.transform(df)

        # Predict using the model
        predictions = model.predict(df_scaled)

        return jsonify(predictions.tolist())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
