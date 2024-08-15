import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import useAuth from "../Hooks/useAuth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VisualizationContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ChartTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
`;

const BudgetVisualizationComponent: React.FC = () => {
  const { auth } = useAuth();
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [], // Ensure labels is an array
    datasets: [],
  });

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/Budget/GetBudgets",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        const data = await response.json();
        const labels = data.budgets.map((budget: any) => budget.name);
        const allocatedAmounts = data.budgets.map(
          (budget: any) => budget.allocatedAmount
        );
        const actualSpending = data.budgets.map(
          (budget: any) => budget.actualSpending
        );

        setChartData({
          labels: labels ?? [], // Default to empty array if labels is undefined
          datasets: [
            {
              label: "Allocated Amount",
              backgroundColor: "#5a67d8",
              data: allocatedAmounts,
            },
            {
              label: "Actual Spending",
              backgroundColor: "#ed64a6",
              data: actualSpending,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchBudgets();
  }, [auth.accessToken]);

  return (
    <VisualizationContainer>
      <ChartTitle>Budget Overview</ChartTitle>
      {chartData.labels && chartData.labels.length > 0 ? ( // Ensure labels is checked for undefined
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Comparison of Allocated Amount vs Actual Spending",
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  font: {
                    size: 12,
                  },
                },
              },
            },
          }}
        />
      ) : (
        <p>No budgets have been created yet.</p>
      )}
    </VisualizationContainer>
  );
};

export default BudgetVisualizationComponent;
