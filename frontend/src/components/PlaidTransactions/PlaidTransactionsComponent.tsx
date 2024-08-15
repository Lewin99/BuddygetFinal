import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import styled from "styled-components";
import useAuth from "../Hooks/useAuth";

const TransactionsContainer = styled(Container)`
  padding: 20px;
  background-color: #f8f9fa;
`;

const TransactionList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const TransactionItem = styled(Card)`
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TransactionDate = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
`;

const TransactionName = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
`;

const TransactionAmount = styled.span<{ amount: number }>`
  font-size: 1rem;
  color: ${(props) => (props.amount > 0 ? "green" : "red")};
`;

interface PlaidTransaction {
  userId: string;
  accountId: string;
  transactionId: string;
  amount: number;
  date: string;
  name: string;
  category: string[];
  pending: boolean;
  transactionType: string;
  location: {
    address: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  merchantName: string;
  paymentChannel: string;
  isoCurrencyCode: string;
  unofficialCurrencyCode: string;
}

const PlaidTransactionsComponent: React.FC = () => {
  const { auth } = useAuth();
  const [transactions, setTransactions] = useState<PlaidTransaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/Transactions/GetTransactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: JSON.stringify({ access_token: auth.accessToken }),
          }
        );
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [auth.accessToken]);

  return (
    <TransactionsContainer>
      <h3>Plaid Transactions</h3>
      <TransactionList>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.transactionId}>
            <Card.Body>
              <TransactionDate>
                {new Date(transaction.date).toLocaleDateString()}
              </TransactionDate>
              <TransactionName>{transaction.name}</TransactionName>
              <TransactionAmount amount={transaction.amount}>
                {transaction.isoCurrencyCode} {transaction.amount}
              </TransactionAmount>
              <div>{transaction.category.join(", ")}</div>
            </Card.Body>
          </TransactionItem>
        ))}
      </TransactionList>
    </TransactionsContainer>
  );
};

export default PlaidTransactionsComponent;
