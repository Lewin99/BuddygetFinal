import React, { useState, useEffect } from "react";
import {
  MainWrapper,
  DashboardHeader,
  DashboardTitle,
  CardsWrapper,
  WalletMoney,
  DashboardHeadersection,
  Card,
  IconWrapper,
  IconSpan,
  CardTitle,
  CardAmount,
  LastUpdated,
  InfoWrapper,
  DataVisualsWrapper,
  BarchartCard,
  BarChartWrapper,
  Title,
  TitleFin,
  FinancialGoalsWrapper,
  StyledTextMuted,
} from "./DashmainStyles";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import BudgetVisualizationComponent from "../BudgetDetails_comp/BudgetVisualizationComponent";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import useAuth from "../Hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
import styled from "styled-components";

interface Account {
  accountId: string;
  name: string;
  balances: {
    current: number;
  };
}

interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  description: string;
}

const GoalCard = styled(Card)`
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px; /* Adjusted width */
`;

const GoalDetails = styled.div`
  flex: 1;
`;

const ProgressContainer = styled.div`
  width: 80px;
  height: 80px;
  margin-left: 20px;
`;

const Main: React.FC = () => {
  const { mode } = useTheme();
  const { auth } = useAuth();
  const [accountBalances, setAccountBalances] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [expenses, setExpenses] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchAccountBalances = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/Budget/GetAccountBalances",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setAccountBalances(data.accounts);
        if (data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0]);
        }
      } catch (error) {
        console.error("Error fetching account balances:", error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/Budget/GetTotalExpenses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setExpenses(data.total);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    const fetchSavings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/Goals/GetTotalSavings",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setSavings(data.total);
      } catch (error) {
        console.error("Error fetching savings:", error);
      }
    };

    const fetchGoals = async () => {
      try {
        const response = await fetch("http://localhost:5000/Goals/GetGoals", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        const data = await response.json();
        setGoals(data.goals || []);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchAccountBalances();
    fetchExpenses();
    fetchSavings();
    fetchGoals();
  }, [auth.accessToken]);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = event.target.value;
    const account = accountBalances.find((acc) => acc.accountId === accountId);
    setSelectedAccount(account || null);
  };

  return (
    <MainWrapper>
      <div className="mywalletSummary">
        <DashboardHeader>
          <DashboardTitle>Dashboard</DashboardTitle>
        </DashboardHeader>

        <DashboardHeadersection>
          <CardsWrapper>
            <WalletMoney>
              <Card
                theme={{
                  textcolor: mode === "dark" ? "#7d8da1" : "#46484a",
                  background: mode === "dark" ? "#181a1e" : "#f6f6f9",
                }}
              >
                <IconWrapper>
                  <IconSpan bgColor="#7380ec">
                    <AccountBalanceWalletOutlinedIcon />
                  </IconSpan>
                </IconWrapper>
                <InfoWrapper>
                  <CardTitle>My Wallet</CardTitle>
                  <div>
                    <select
                      onChange={handleAccountChange}
                      value={selectedAccount?.accountId || ""}
                    >
                      {accountBalances.map((account) => (
                        <option
                          key={account.accountId}
                          value={account.accountId}
                        >
                          {account.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedAccount && (
                    <CardAmount>
                      ${selectedAccount.balances.current.toFixed(2)}
                    </CardAmount>
                  )}
                </InfoWrapper>
                <LastUpdated>
                  <StyledTextMuted>Last 24 Hours</StyledTextMuted>
                </LastUpdated>
              </Card>
              <Card
                theme={{
                  textcolor: mode === "dark" ? "#7d8da1" : "#46484a",
                  background: mode === "dark" ? "#181a1e" : "#f6f6f9",
                }}
              >
                <IconWrapper>
                  <IconSpan bgColor="#41f1b6">
                    <TrendingUpOutlinedIcon />
                  </IconSpan>
                </IconWrapper>
                <InfoWrapper>
                  <CardTitle>Expenses</CardTitle>
                  <CardAmount>${expenses.toFixed(2)}</CardAmount>
                </InfoWrapper>
                <LastUpdated>
                  <StyledTextMuted>Last 24 Hours</StyledTextMuted>
                </LastUpdated>
              </Card>
              <Card
                theme={{
                  textcolor: mode === "dark" ? "#7d8da1" : "#46484a",
                  background: mode === "dark" ? "#181a1e" : "#f6f6f9",
                }}
              >
                <IconWrapper>
                  <IconSpan bgColor="#ff7782">
                    <TrendingDownOutlinedIcon />
                  </IconSpan>
                </IconWrapper>
                <InfoWrapper>
                  <CardTitle>Savings</CardTitle>
                  <CardAmount>${savings.toFixed(2)}</CardAmount>
                </InfoWrapper>
                <LastUpdated>
                  <StyledTextMuted>Last 24 Hours</StyledTextMuted>
                </LastUpdated>
              </Card>
            </WalletMoney>
          </CardsWrapper>
        </DashboardHeadersection>
      </div>

      {/* Data Visuals section */}
      <DataVisualsWrapper>
        <BarchartCard
          theme={{
            textcolor: mode === "dark" ? "#7d8da1" : "#46484a",
            background: mode === "dark" ? "#181a1e" : "#f6f6f9",
          }}
        >
          <BarChartWrapper>
            <Title
              theme={{
                textcolor: mode === "dark" ? "#7d8da1" : "#46484a",
              }}
            >
              Budgets Overview
            </Title>
            <BudgetVisualizationComponent />
          </BarChartWrapper>
        </BarchartCard>

        <FinancialGoalsWrapper
          theme={{
            textcolor: mode === "dark" ? "#7d8da1" : "#46484a",
            background: mode === "dark" ? "#181a1e" : "#f6f6f9",
          }}
        >
          <TitleFin
            theme={{
              textcolor: mode === "dark" ? "#7d8da1" : "#46484a",
            }}
          >
            Financial Goals
          </TitleFin>
          {goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard key={goal._id}>
                <GoalDetails>
                  <h5>{goal.name}</h5>
                  <p>{goal.description}</p>
                  <p>
                    Target: ${goal.targetAmount.toFixed(2)} <br />
                    Current: ${goal.currentAmount.toFixed(2)}
                  </p>
                </GoalDetails>
                <ProgressContainer>
                  <CircularProgressbar
                    value={(goal.currentAmount / goal.targetAmount) * 100}
                    text={`${Math.round(
                      (goal.currentAmount / goal.targetAmount) * 100
                    )}%`}
                    styles={buildStyles({
                      pathColor: "#124275",
                      textColor: "#124275",
                      trailColor: "#d6d6d6",
                      backgroundColor: "#f6f6f9",
                    })}
                  />
                </ProgressContainer>
              </GoalCard>
            ))
          ) : (
            <p>No financial goals set.</p>
          )}
        </FinancialGoalsWrapper>
      </DataVisualsWrapper>
    </MainWrapper>
  );
};

export default Main;
