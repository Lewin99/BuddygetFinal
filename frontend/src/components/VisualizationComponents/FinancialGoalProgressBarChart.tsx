import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";
import styled from "styled-components";

interface FinancialGoalTransaction {
  goalName: string;
  amountAdded: number;
}

interface FinancialGoalProgressBarChartProps {
  transactions: FinancialGoalTransaction[];
}

const ChartContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  width: 90%;
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  color: #333;
`;

const FinancialGoalProgressBarChart: React.FC<
  FinancialGoalProgressBarChartProps
> = ({ transactions }) => {
  const data = transactions.map((transaction) => ({
    goalName: transaction.goalName,
    amountAdded: transaction.amountAdded,
  }));

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="goalName">
            <Label value="Goal Name" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Amount Added" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Legend />
          <Bar
            dataKey="amountAdded"
            fill="#3f9739"
            label={{ position: "top" }}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default FinancialGoalProgressBarChart;
