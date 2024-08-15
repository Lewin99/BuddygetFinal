import React from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";

type Insight = {
  Category: string[];
  PredictedAmount: number;
};

type InsightComponentProps = {
  insights: Insight[];
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  max-width: 1200px;
  background-color: #f9f9f9;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;

const InsightContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 400px;
  text-align: left;
  background-color: #fff;
`;

const CardHeader = styled.div<{ isExpense: boolean }>`
  background-color: ${({ isExpense }) => (isExpense ? "#f8d7da" : "#d4edda")};
  padding: 10px;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
  color: ${({ isExpense }) => (isExpense ? "#721c24" : "#155724")};
  margin-bottom: 10px;
`;

const StyledBar = styled.div`
  width: 100%;
  max-width: 750px;
  height: 400px;
  margin-top: 20px;
`;

const InsightComponent: React.FC<InsightComponentProps> = ({ insights }) => {
  // Categories considered as income
  const incomeCategories = ["Transfer", "Payroll", "Income", "Deposit"];

  // Filter out insights that are considered income
  const expenseInsights = insights.filter(
    (insight) =>
      !insight.Category.some((category) => incomeCategories.includes(category))
  );

  const uniqueInsights = expenseInsights.filter(
    (insight, index, self) =>
      index ===
      self.findIndex(
        (t) => t.Category.join(", ") === insight.Category.join(", ")
      )
  );

  const chartData = {
    labels: uniqueInsights.map((insight) => insight.Category.join(", ")),
    datasets: [
      {
        label: "Predicted Amount",
        data: uniqueInsights.map((insight) => insight.PredictedAmount),
        backgroundColor: uniqueInsights.map((insight) =>
          insight.PredictedAmount > 0 ? "#4caf50" : "#f44336"
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container>
      <h2>Predicted Financial Insights</h2>

      <InsightContainer>
        {uniqueInsights.map((insight, index) => (
          <Card key={index}>
            <CardHeader isExpense={insight.PredictedAmount < 0}>
              {insight.Category.join(", ")}
            </CardHeader>
            <div>
              <strong>Predicted Amount:</strong> $
              {Math.abs(insight.PredictedAmount).toFixed(2)}
            </div>
          </Card>
        ))}
      </InsightContainer>

      <StyledBar>
        <Bar data={chartData} options={{ maintainAspectRatio: false }} />
      </StyledBar>
    </Container>
  );
};

export default InsightComponent;
