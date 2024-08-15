import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import { format } from "date-fns";
import useAuth from "../Hooks/useAuth";

const TransactionsContainer = styled(Container)`
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const TransactionList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const TransactionItem = styled.div`
  background: #fff;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const TransactionDate = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const TransactionName = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const TransactionDescription = styled.span`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 5px;
`;

const TransactionAmount = styled.span<{ amount: number }>`
  font-size: 1rem;
  color: ${(props) => (props.amount > 0 ? "green" : "red")};
  font-weight: bold;
`;

interface FinancialGoalTransaction {
  userId: string;
  goalId: string;
  goalName: string;
  goalDescription: string;
  amountAdded: number;
  date: string;
}

const FinancialGoalTransactionsComponent: React.FC = () => {
  const { auth } = useAuth();
  const [transactions, setTransactions] = useState<FinancialGoalTransaction[]>(
    []
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/finbudTransactions/FinancialGoalTransactions/GetFinancialGoalTransactions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setTransactions(data.financialGoalTransactions);
      } catch (error) {
        console.error("Error fetching financial goal transactions:", error);
      }
    };

    fetchTransactions();
  }, [auth.accessToken]);

  return (
    <TransactionsContainer>
      <h3>Financial Goal Transactions</h3>
      <TransactionList>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.goalId}>
            <TransactionDate>
              {format(new Date(transaction.date), "yyyy-MM-dd")}
            </TransactionDate>
            <TransactionName>{transaction.goalName}</TransactionName>
            <TransactionDescription>
              {transaction.goalDescription}
            </TransactionDescription>
            <TransactionAmount amount={transaction.amountAdded}>
              {transaction.amountAdded > 0 ? "+" : "-"}
              {transaction.amountAdded}
            </TransactionAmount>
          </TransactionItem>
        ))}
      </TransactionList>
    </TransactionsContainer>
  );
};

export default FinancialGoalTransactionsComponent;
