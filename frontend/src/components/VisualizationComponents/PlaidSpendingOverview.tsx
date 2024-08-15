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

interface PlaidTransaction {
  date: string;
  amount: number;
}

interface PlaidSpendingOverviewProps {
  transactions: PlaidTransaction[];
}

const ChartContainer = styled.div`
  margin-top: 20px;
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

const PlaidSpendingOverview: React.FC<PlaidSpendingOverviewProps> = ({
  transactions,
}) => {
  const data = transactions.map((transaction) => ({
    date: new Date(transaction.date).toLocaleDateString(),
    amount: transaction.amount,
  }));

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date">
            <Label value="Date" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Amount" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#2633c0" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PlaidSpendingOverview;
