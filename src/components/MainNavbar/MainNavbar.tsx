import { FC } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import ToggleTheme from '../ToggleTheme/ToggleTheme';
import { useTheme } from '../../context/themeContext';
import styles from './MainNavbar.module.scss';

import Container from 'react-bootstrap/Container';

const MainNavbar: FC = () => {
  const { theme } = useTheme();
  return (
    <Navbar
      className={styles[`mainNavBar__container`]}
      expand="lg"
      bg={theme === 'dark' ? 'dark' : 'white'}
      data-bs-theme={theme}
      data-testid="MainNavbar"
    >
      <Container fluid className="mx-5">
        <Navbar.Brand href="/">Time Playground</Navbar.Brand>
        <div className="d-flex align-items-center">
          <Navbar.Toggle
            aria-controls="main-navbar-nav"
            className={styles[`mainNavBar__toggler-icon`]}
          />
          <ToggleTheme className="d-lg-none" />
        </div>

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto" navbarScroll>
            <Nav.Link as={NavLink} to="/datepicker">
              Date Picker
            </Nav.Link>
            <Nav.Link as={NavLink} to="/daterange">
              Date Range
            </Nav.Link>
            <Nav.Link as={NavLink} to="berlinclock">
              Berlin Clock
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <ToggleTheme className="d-none d-lg-block " />
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
