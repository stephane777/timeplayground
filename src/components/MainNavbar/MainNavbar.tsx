import React, { FC } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import ToggleTheme from '../ToggleTheme/ToggleTheme';
import { useTheme } from '../../context/themeContext';
import styles from './MainNavbar.module.scss';

// import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'

const MainNavbar: FC = () => {
  const { theme } = useTheme();
  return (
    <Navbar expand="lg" bg={theme} data-bs-theme={theme}>
      <Container>
        <Navbar.Brand href="#home">Time Playground</Navbar.Brand>
        <ToggleTheme className="me-auto" />
        <Navbar.Toggle
          aria-controls="main-navbar-nav"
          className={styles[`mainNavBar__toggler-icon`]}
        />
        {/* <Stack direction="horizontal" gap={3} className="ms-auto"> */}
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto" navbarScroll>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/datepicker">
              Date Picker
            </Nav.Link>
            <Nav.Link as={Link} to="/daterange">
              Date Range
            </Nav.Link>
            <Nav.Link as={Link} to="berlinclock">
              Berlin Clock
            </Nav.Link>
            {/* <ToggleTheme /> */}
          </Nav>
        </Navbar.Collapse>
        {/* </Stack> */}
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
