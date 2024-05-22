import React from 'react';
import { useTheme } from '../../context/themeContext';
import { NavLink } from 'react-router-dom';
// import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import Container from 'react-bootstrap/Container';
import sprite from '../../assets/img/svg/sprite.svg';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Nav from 'react-bootstrap/Nav';
// import { Button, ListGroup } from 'react-bootstrap';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <div className={styles[`footer__container`]}>
      <Container>
        <Row className="mt-5">
          <Col sm={3}>
            <h6 className={styles['footer__heading']}>Time Playground</h6>
            <Nav data-bs-theme={theme} as="ul" className="flex-column" aria-label="footer menu">
              <Nav.Item as="li">
                <Nav.Link
                  as={NavLink}
                  to="/datepicker"
                  className={styles['footer__link']}
                  aria-label="footer date picker"
                >
                  Date Picker
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  as={NavLink}
                  to="/daterange "
                  className={styles['footer__link']}
                  aria-label="footer date range"
                >
                  Date Range
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  as={NavLink}
                  to="berlinclock"
                  className={styles['footer__link']}
                  aria-label="footer berlin clock"
                >
                  Berlin Clock
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={3}>
            <h6 className={styles['footer__heading']}>Tools</h6>
            <Nav data-bs-theme={theme} as="ul" className="flex-column" aria-label="footer tools">
              <Nav.Item as="li" className={styles['footer__listitem']}>
                React-transition-group
              </Nav.Item>
              <Nav.Item as="li" className={styles['footer__listitem']}>
                Jest / react-testing-library
              </Nav.Item>
              <Nav.Item as="li" className={styles['footer__listitem']}>
                Typescript
              </Nav.Item>
              <Nav.Item as="li" className={styles['footer__listitem']}>
                React v18
              </Nav.Item>
              <Nav.Item as="li" className={styles['footer__listitem']}>
                Webpack
              </Nav.Item>
              <Nav.Item as="li" className={styles['footer__listitem']}>
                Cypress
              </Nav.Item>
              <Nav.Item as="li" className={styles['footer__listitem']}>
                Sass
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <ul
            className="d-flex justify-content-center align-items-center gap-3"
            aria-label="footer copyright"
          >
            <li className={styles['footer__copyright']}>Copyright &copy; 2024</li>
            <li>
              <a href="https://github.com/stephane777" className="d-inline-block">
                <svg
                  role="img"
                  aria-labelledby="github_icon"
                  focusable={true}
                  className={styles['footer__icon']}
                >
                  <title id="github_icon">Github icon link</title>
                  <use
                    data-testid="github_icon_use"
                    href={`${sprite}#icon-github`}
                    fill={theme === 'dark' ? 'white' : '#0e1624'}
                  ></use>
                </svg>
              </a>
            </li>
            <li>
              <p className={styles['footer__copyright']}>by Stephane Candelas.</p>
            </li>
          </ul>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
