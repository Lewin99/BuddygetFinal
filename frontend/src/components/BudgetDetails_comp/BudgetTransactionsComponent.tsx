import React, { useState, useEffect } from "react";
import { Container, Form, Card } from "react-bootstrap";
import styled from "styled-components";
import useAuth from "../Hooks/useAuth";

const FullScreenContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #f4f4f9;
  min-height: 100vh;
  width: 100%;
`;

const BudgetHeader = styled.div`
  width: 80%;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  text-align: center;
`;

const BudgetTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333333;
`;

const BudgetDetails = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 0.8rem;
  color: #666666;
`;

const BudgetDetail = styled.div`
  flex: 1;
  text-align: center;
`;

const BudgetSelector = styled(Form.Group)`
  width: 80%;
  margin-bottom: 10px;

  & > label {
    font-size: 0.8rem;
    font-weight: bold;
    color: #333333;
    margin-bottom: 5px;
    display: block;
    text-align: center;
  }

  & > select {
    width: 100%;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ced4da;
    font-size: 0.8rem;
  }
`;

const TransactionsContainer = styled(Card)`
  width: 80%;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TransactionsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const TransactionItem = styled(Card)`
  margin: 5px 0;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

const TransactionDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TransactionDate = styled.span`
  color: #6c757d;
  font-size: 0.8rem;
`;

const TransactionName = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
`;

const TransactionAmount = styled.span<{ amount: number }>`
  font-size: 0.9rem;
  color: ${(props) => (props.amount < 0 ? "red" : "green")};
`;

interface Transaction {
  transactionId: string;
  amount: number;
  date: string;
  name: string;
  category: string[];
  budgetId?: string;
}

interface Budget {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  allocatedAmount: number;
}

const BudgetTransactionsComponent: React.FC = () => {
  const { auth } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [spentAmount, setSpentAmount] = useState<number>(0);

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
        setBudgets(data.budgets);
        if (data.budgets.length > 0) {
          setSelectedBudgetId(data.budgets[0]._id);
          setSelectedBudget(data.budgets[0]);
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchBudgets();
  }, [auth.accessToken]);

  useEffect(() => {
    if (selectedBudgetId) {
      const fetchTransactions = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/Transactions/GetTransactionsByBudget/${selectedBudgetId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.accessToken}`,
              },
            }
          );
          const data = await response.json();
          setTransactions(data.transactions);
          setSpentAmount(
            data.transactions.reduce(
              (total: number, t: Transaction) => total + Math.abs(t.amount),
              0
            )
          );
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      };

      fetchTransactions();
    }
  }, [selectedBudgetId, auth.accessToken]);

  useEffect(() => {
    if (selectedBudgetId) {
      const budget = budgets.find((b) => b._id === selectedBudgetId);
      setSelectedBudget(budget || null);
    }
  }, [selectedBudgetId, budgets]);

  return (
    <FullScreenContainer>
      <BudgetSelector controlId="budgetSelect">
        <Form.Label>Select Budget</Form.Label>
        <Form.Control
          as="select"
          value={selectedBudgetId}
          onChange={(e) => setSelectedBudgetId(e.target.value)}
        >
          <option value="">Select Budget...</option>
          {budgets.map((budget) => (
            <option key={budget._id} value={budget._id}>
              {budget.name}
            </option>
          ))}
        </Form.Control>
      </BudgetSelector>

      {selectedBudget && (
        <BudgetHeader>
          <BudgetTitle>{selectedBudget.name}</BudgetTitle>
          <BudgetDetails>
            <BudgetDetail>
              <strong>Start Date:</strong>{" "}
              {new Date(selectedBudget.startDate).toLocaleDateString()}
            </BudgetDetail>
            <BudgetDetail>
              <strong>End Date:</strong>{" "}
              {new Date(selectedBudget.endDate).toLocaleDateString()}
            </BudgetDetail>
            <BudgetDetail>
              <strong> Amount:</strong> $
              {selectedBudget.allocatedAmount.toFixed(2)}
            </BudgetDetail>
            <BudgetDetail>
              <strong>Spent:</strong> ${spentAmount.toFixed(2)}
            </BudgetDetail>
          </BudgetDetails>
        </BudgetHeader>
      )}

      <TransactionsContainer>
        <h4>Spending</h4>
        <TransactionsList>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.transactionId}>
              <Card.Body>
                <TransactionDetail>
                  <div>
                    <TransactionDate>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TransactionDate>
                    <TransactionName>{transaction.name}</TransactionName>
                  </div>
                  <TransactionAmount amount={transaction.amount}>
                    {transaction.amount}
                  </TransactionAmount>
                </TransactionDetail>
                <div>{transaction.category.join(", ")}</div>
              </Card.Body>
            </TransactionItem>
          ))}
        </TransactionsList>
      </TransactionsContainer>
    </FullScreenContainer>
  );
};

export default BudgetTransactionsComponent;
