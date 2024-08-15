import React, { useState } from "react";
import useAuth from "../Hooks/useAuth";
import InsightComponent from "./InsightComponent"; // Import the InsightComponent
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
`;

const Description = styled.p`
  max-width: 600px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.1em;
  color: #555;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2em;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const InsightButton: React.FC = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your Express server endpoint
      const response = await fetch(
        "http://localhost:5000/predictions/predictFutureSpending",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setInsight(data.predictions);
    } catch (err) {
      setError("Error fetching insight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {!insight && (
        <>
          <Description>
            Click the button below to receive predictions for your monthly
            expenses by category. These insights are based on your past spending
            habits and can help you plan your budget, identify potential
            savings, and manage your finances more effectively.
          </Description>
          <Button onClick={handleClick} disabled={loading}>
            {loading ? "Loading..." : "Get Insight"}
          </Button>
        </>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {insight && <InsightComponent insights={insight} />}
    </Container>
  );
};

export default InsightButton;
