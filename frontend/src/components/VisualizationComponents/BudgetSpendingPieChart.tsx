import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styled from "styled-components";

interface BudgetTransaction {
  budgetName: string;
  amountUsed: number;
}

interface BudgetSpendingPieChartProps {
  transactions: BudgetTransaction[];
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA44BB"];

const BudgetSpendingPieChart: React.FC<BudgetSpendingPieChartProps> = ({
  transactions,
}) => {
  const data = transactions.reduce((acc, transaction) => {
    const index = acc.findIndex((item) => item.name === transaction.budgetName);
    if (index !== -1) {
      acc[index].value += transaction.amountUsed;
    } else {
      acc.push({ name: transaction.budgetName, value: transaction.amountUsed });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default BudgetSpendingPieChart;
