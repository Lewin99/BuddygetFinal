import React, { useState } from "react";
import { Modal, Form, Row, Col, Card, Container } from "react-bootstrap";
import styled from "styled-components";
import useAuth from "../Hooks/useAuth";
import AssignTransactionsComponent from "../PlaidTransactions/AssignTransactionsCompenent";
import BudgetTransactionsComponent from "../BudgetDetails_comp/BudgetTransactionsComponent";
import BudgetVisualizationComponent from "../BudgetDetails_comp/BudgetVisualizationComponent";

const CustomForm = styled(Form)`
  margin-bottom: 20px;
`;

const CustomButton = styled.button`
  background-color: #5a67d8;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 20px;
  &:hover {
    background-color: #434190;
  }
`;

const ModalHeader = styled(Modal.Header)`
  background-color: #5a67d8;
  color: #fff;
`;

const ModalTitle = styled(Modal.Title)`
  font-weight: bold;
`;

const StyledContainer = styled(Container)`
  padding: 20px;
  background-color: #f8f9fa;
`;

const Title = styled.h4`
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
`;

const StyledCard = styled(Card)`
  margin: 10px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: 500px;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const VisualizationContainer = styled.div`
  width: 100%;
  max-width: 70%;
  margin: 20px auto;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const BudgetComponent: React.FC = () => {
  const { auth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleCreateBudget = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!budgetName || !startDate || !endDate || !description || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    const newBudget = {
      name: budgetName,
      startDate,
      endDate,
      description,
      allocatedAmount: Number(amount),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/Budget/CreateBudget",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
          body: JSON.stringify(newBudget),
        }
      );

      if (response.ok) {
        setBudgetName("");
        setStartDate("");
        setEndDate("");
        setDescription("");
        setAmount("");
        handleClose();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error("Failed to save budget:", error);
      alert("Failed to save budget. Please try again later.");
    }
  };

  return (
    <StyledContainer>
      <CustomButton onClick={handleShow}>Create Budget</CustomButton>

      <Row>
        <Col md={6}>
          <Title>Assign Transactions</Title>
          <StyledCard>
            <AssignTransactionsComponent />
          </StyledCard>
        </Col>
        <Col md={6}>
          <Title>Budget Transactions</Title>
          <StyledCard>
            <BudgetTransactionsComponent />
          </StyledCard>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <VisualizationContainer>
            <BudgetVisualizationComponent />
          </VisualizationContainer>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <ModalHeader closeButton>
          <ModalTitle>Create a New Budget</ModalTitle>
        </ModalHeader>
        <Modal.Body>
          <CustomForm onSubmit={handleCreateBudget}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3">
                Budget Name
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="Enter budget name"
                  value={budgetName}
                  required
                  onChange={(e) => setBudgetName(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3">
                Start Date
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="date"
                  value={startDate}
                  required
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3">
                End Date
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="date"
                  value={endDate}
                  required
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3">
                Description
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="Enter budget description"
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3">
                Allocated Amount
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="number"
                  placeholder="Enter allocated amount"
                  value={amount}
                  required
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Col>
            </Form.Group>
            <div className="text-center">
              <CustomButton type="submit">Create Budget</CustomButton>
            </div>
          </CustomForm>
        </Modal.Body>
      </Modal>
    </StyledContainer>
  );
};

export default BudgetComponent;
