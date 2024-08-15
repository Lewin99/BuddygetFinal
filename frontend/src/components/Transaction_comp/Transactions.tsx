import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import styled from "styled-components";
import PlaidTransactionsComponent from "../PlaidTransactions/PlaidTransactionsComponent";
import FinancialGoalTransactionsComponent from "../FinancialGoalsTrans/FinancialGoalTransactionsComponent";
import PlaidSpendingOverview from "../VisualizationComponents/PlaidSpendingOverview";
import FinancialGoalProgressBarChart from "../VisualizationComponents/FinancialGoalProgressBarChart";
import useAuth from "../Hooks/useAuth";

const TransactionsContainer = styled(Container)`
  padding: 20px;
  background-color: #f8f9fa;
  max-width: 1200px;
`;

const TransactionsTitle = styled.h2`
  text-align: center;
  padding: 20px 0;
  font-weight: bold;
`;

const VisualizationCard = styled(Card)`
  margin-bottom: 20px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const VisualizationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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

interface FinancialGoalTransaction {
  userId: string;
  goalId: string;
  goalName: string;
  goalDescription: string;
  amountAdded: number;
  date: string;
}

const TransactionsComponent: React.FC = () => {
  const { auth } = useAuth();
  const [plaidTransactions, setPlaidTransactions] = useState<
    PlaidTransaction[]
  >([]);
  const [financialGoalTransactions, setFinancialGoalTransactions] = useState<
    FinancialGoalTransaction[]
  >([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const plaidResponse = await fetch(
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
        const plaidData = await plaidResponse.json();
        setPlaidTransactions(plaidData.transactions);

        const financialGoalResponse = await fetch(
          "http://localhost:5000/finbudTransactions/FinancialGoalTransactions/GetFinancialGoalTransactions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        const financialGoalData = await financialGoalResponse.json();
        setFinancialGoalTransactions(
          financialGoalData.financialGoalTransactions
        );
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [auth.accessToken]);

  return (
    <TransactionsContainer>
      <TransactionsTitle>Transactions</TransactionsTitle>

      {/* Plaid Transactions */}
      {plaidTransactions.length > 0 && (
        <VisualizationCard>
          <Card.Body>
            <Row>
              <Col md={6}>
                <PlaidTransactionsComponent />
              </Col>
              <Col md={6}>
                <VisualizationWrapper>
                  <PlaidSpendingOverview transactions={plaidTransactions} />
                </VisualizationWrapper>
              </Col>
            </Row>
          </Card.Body>
        </VisualizationCard>
      )}

      {/* Financial Goal Transactions */}
      {financialGoalTransactions.length > 0 && (
        <VisualizationCard>
          <Card.Body>
            <Row>
              <Col md={6}>
                <FinancialGoalTransactionsComponent />
              </Col>
              <Col md={6}>
                <VisualizationWrapper>
                  <FinancialGoalProgressBarChart
                    transactions={financialGoalTransactions}
                  />
                </VisualizationWrapper>
              </Col>
            </Row>
          </Card.Body>
        </VisualizationCard>
      )}
    </TransactionsContainer>
  );
};

export default TransactionsComponent;
