import React from "react";
import styled from "styled-components";
import { Button, Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const LandingPageContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.8; /* Adjust opacity as needed */
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black; /* Black overlay */
  opacity: 0.6; /* Adjust opacity to make content more visible */
  z-index: -1;
`;

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 10%; /* Left aligned */
  transform: translateY(-50%);
  color: white;
  max-width: 600px;
  text-align: left; /* Left-aligned text */
`;

const Title = styled.h1`
  font-size: 48px;
  color: white;
  font-weight: bold; /* Bold title */
  margin-bottom: 20px;
`;

const Description = styled.h4`
  font-size: 20px;
  color: #c0c0c0; /* Blue-black color */
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  background-color: #124275;
  border: none;
  margin: 5px;
  padding: 10px 20px; /* Add padding */
  border-radius: 5px; /* Add border-radius */
  text-decoration: none; /* Remove text decoration */
  color: white; /* Set text color to white */
  &:hover {
    background-color: #18416d;
  }
`;

const StyledNavbar = styled(Navbar)`
  background-color: black;
  height: 70px;
`;

const NavbarToggle = styled(Navbar.Toggle)`
  border: none;
  color: white; /* White color for the hamburger menu icon */
  & .navbar-toggler-icon {
    filter: invert(100%); /* This will make the icon white */
  }
  &:focus,
  &:hover {
    color: white; /* Ensure the color remains white on focus and hover */
  }
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const AppName = styled.span`
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const NavbarCollapse = styled(Navbar.Collapse)`
  @media (max-width: 991px) {
    background-color: black;
    padding: 10px;
    position: absolute;
    top: 70px;
    right: 0;
    width: 200px; /* Adjust the width as needed */
    z-index: 10;
  }
`;

const NavbarNav = styled(Nav)`
  margin-left: auto; /* Ensure buttons are aligned to the right on large screens */
`;

const LandingPage: React.FC = () => {
  return (
    <LandingPageContainer>
      <StyledNavbar expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <Logo
              src="https://i.ibb.co/v30tzD8/pngaaa-com-4457319.png"
              alt="Logo"
            />
            <AppName>Buddyget</AppName>
          </Navbar.Brand>
          <NavbarToggle aria-controls="basic-navbar-nav" />
          <NavbarCollapse id="basic-navbar-nav">
            <NavbarNav>
              <StyledButton as={Link} to="/login">
                Sign In
              </StyledButton>
              <StyledButton as={Link} to="/register">
                Create Account
              </StyledButton>
            </NavbarNav>
          </NavbarCollapse>
        </Container>
      </StyledNavbar>

      <BackgroundVideo autoPlay loop muted>
        <source
          src="https://media.istockphoto.com/id/1397224160/video/4k-abstract-technologic-background-loopable-blue-and-orange.mp4?s=mp4-640x640-is&k=20&c=B9yhMMvXfotaSTYjHR8a97RKihZpPEwcV2UkAjC5YS0="
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </BackgroundVideo>

      <Overlay />

      <Content>
        <Title>Buddyget,</Title>
        <Title>Your Personal Financial App Buddy</Title>
        <Description>
          Buddyget is your personal finance companion that helps you manage your
          savings and reach your financial goals with ease.
        </Description>
        <Description>
          Track your expenses, set savings goals, and achieve financial freedom
          with our intuitive and user-friendly platform. Join us and take
          control of your finances today!
        </Description>
        <StyledButton as={Link} to="/login">
          Sign In
        </StyledButton>
      </Content>
    </LandingPageContainer>
  );
};

export default LandingPage;
