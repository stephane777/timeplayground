import React from 'react';
import { useTheme } from '../../context/themeContext';
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './Home.module.scss';
import dp_light from '../../assets/img/png/dp_light.png';
import dp_dark from '../../assets/img/png/dp_dark.png';
import bc_light from '../../assets/img/png/bc_light.png';
import bc_dark from '../../assets/img/png/bc_dark.png';
import dr_light from '../../assets/img/png/dr_light.png';
import dr_dark from '../../assets/img/png/dr_dark.png';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { theme } = useTheme();
  return (
    <Container fluid="sm" className={styles[`HomePage__wrapper`]}>
      <section className="my-7">
        <h3 className="">Date picker</h3>
        <Row className="justify-content-center g-6">
          <Col lg="3" className="d-flex justify-content-end">
            <Link to="/datePicker">
              <Figure aria-label="date picker screenshot">
                <Figure.Image
                  width={250}
                  alt="date picker screenshot"
                  src={theme === 'dark' ? dp_dark : dp_light}
                />
              </Figure>
            </Link>
          </Col>
          <Col lg="3" className="flex-column align-content-center justify-content-center">
            <h6>Tools</h6>
            <ul>
              <li>React</li>
              <li>Typescript</li>
              <li>React-bootstrap</li>
              <li>React-transition-group</li>
              <li>date : vanilla js</li>
            </ul>
          </Col>
        </Row>
      </section>
      <section className="my-7">
        <h3 className="">Date range</h3>
        <Row className="justify-content-center g-6">
          <Col lg="4">
            <Link to="/dateRange">
              <Figure aria-label="date range screenshot">
                <Figure.Image
                  width={450}
                  alt="date range screenshot"
                  src={theme === 'dark' ? dr_dark : dr_light}
                />
              </Figure>
            </Link>
          </Col>
          <Col lg="4" className="flex-column align-content-center justify-content-center">
            <h6>Tools</h6>
            <ul>
              <li>React</li>
              <li>Typescript</li>
              <li>React-bootstrap</li>
              <li>React-transition-group</li>
              <li>date : moment.js</li>
            </ul>
          </Col>
        </Row>
      </section>
      <section className="my-7">
        <h3 className="">Berlin clock</h3>
        <Row className="justify-content-center g-6">
          <Col lg="3">
            <Link to="/berlinclock">
              <Figure aria-label="berlin clock screenshot">
                <Figure.Image
                  width={250}
                  alt="berlin clock screenshot"
                  src={theme === 'dark' ? bc_dark : bc_light}
                />
              </Figure>
            </Link>
          </Col>
          <Col lg="3" className="flex-column align-content-center justify-content-center">
            <h6>Tools</h6>
            <ul>
              <li>React</li>
              <li>React-bootstrap</li>
              <li>Typescript</li>
              <li>date : moment.js/timezone</li>
            </ul>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default HomePage;
