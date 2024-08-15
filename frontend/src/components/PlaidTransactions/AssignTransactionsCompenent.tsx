import React, { useState, useEffect } from "react";
import { Container, Card, Modal, Button, Form } from "react-bootstrap";
import styled from "styled-components";
import useAuth from "../Hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const TransactionsContainer = styled(Container)`
  padding: 10px;
  background-color: #f8f9fa;
`;

const TransactionList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const TransactionItem = styled(Card)`
  margin: 5px 0;
  padding: 8px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TransactionDate = styled.span`
  color: #6c757d;
  font-size: 0.8rem;
`;

const TransactionName = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

const TransactionAmount = styled.span<{ amount: number }>`
  font-size: 0.9rem;
  color: ${(props) => (props.amount < 0 ? "red" : "green")};
`;

interface PlaidTransaction {
  transactionId: string;
  amount: number;
  date: string;
  name: string;
  category: string[];
}

interface Budget {
  _id: string;
  name: string;
}

const AssignTransactionsComponent: React.FC = () => {
  const { auth } = useAuth();
  const [transactions, setTransactions] = useState<PlaidTransaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PlaidTransaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");

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
        setTransactions(
          data.transactions.filter((tx: PlaidTransaction) => tx.amount > 0)
        );
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

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
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchTransactions();
    fetchBudgets();
  }, [auth.accessToken]);

  const handleAssignBudget = (transaction: PlaidTransaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedBudgetId || !selectedTransaction) {
      alert("Please select a budget.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/Transactions/AssignBudget/${selectedTransaction.transactionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
          body: JSON.stringify({ budgetId: selectedBudgetId }),
        }
      );

      if (response.ok) {
        alert("Budget assigned successfully!");
        setShowModal(false);
      } else {
        alert("Failed to assign budget. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning budget:", error);
      alert("Failed to assign budget. Please try again later.");
    }
  };

  return (
    <TransactionsContainer>
      <h4>Plaid Transactions</h4>
      <TransactionList>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.transactionId}>
            <Card.Body>
              <TransactionDate>
                {new Date(transaction.date).toLocaleDateString()}
              </TransactionDate>
              <TransactionName>{transaction.name}</TransactionName>
              <TransactionAmount amount={transaction.amount}>
                {transaction.amount}
              </TransactionAmount>
              <div>{transaction.category.join(", ")}</div>
              <Button
                variant="light"
                onClick={() => handleAssignBudget(transaction)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </Card.Body>
          </TransactionItem>
        ))}
      </TransactionList>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="budgetSelect">
            <Form.Label>Select Budget</Form.Label>
            <Form.Control
              as="select"
              value={selectedBudgetId}
              onChange={(e) => setSelectedBudgetId(e.target.value)}
            >
              <option value="">Choose...</option>
              {budgets.map((budget) => (
                <option key={budget._id} value={budget._id}>
                  {budget.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </TransactionsContainer>
  );
};

export default AssignTransactionsComponent;
