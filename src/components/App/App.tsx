import React, { FC, ReactNode } from 'react';
import MainNavbar from '../MainNavbar/MainNavbar';
import { useTheme } from '../../context/themeContext';
import styles from './App.module.scss';
import classNames from 'classnames';
import DatePicker from '../DatePicker/DatePicker';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Figure from 'react-bootstrap/Figure';
import img2 from '../../assets/img/png/MonthCard_Next.png';
import img1 from '../../assets/img/png/MonthCard_prev.png';

const App: FC = () => {
  const { theme } = useTheme();

  const classes = classNames(styles[`theme--${theme}`], styles[`theme`]);

  return (
    <div className={classes}>
      <header>
        <MainNavbar />
      </header>
      <main>
        <Container fluid="sm" className="pt-5">
          <div className={styles[`container__datePicker`]}>
            <DatePicker speed={300} />
          </div>

          <h3 className="my-5">Overview:</h3>
          <p>
            This was a project I've build few years back and it is time to refactor it with
            Typescript and a smooth animation with{' '}
            <Button
              className="p-0 text-decoration-none border-0"
              variant="link"
              href="https://reactcommunity.org/react-transition-group/"
            >
              react-transition-group
            </Button>
            .
            <br />
            The date picker is built with a Form.Control type='text' from{' '}
            <Button
              className="p-0 text-decoration-none border-0"
              variant="link"
              href="https://react-bootstrap.netlify.app/"
            >
              React Bootstrap
            </Button>{' '}
            package. The dropdown is entirely built with React.
            <br />
            Before jumping into details let's break down what we need to achieve. First when the
            user click the arrow right or left we need to render 2 months side by side. Then the
            transition is active for few milliseconds. When the animation is ending setting the new
            state <b>time</b>.
          </p>
          <p></p>
          <h3 className="my-5">Render current month & next or previous month: </h3>
          <Container>
            <p>
              Clicking the arrow left will render the `MonthCard` component with the current
              selected month and the previous month
            </p>
            <div className={styles[`container__datePicker`]}>
              <DatePicker speed={1000} demo />
            </div>
            <Row>
              <Col lg="6">
                <Figure>
                  <Figure.Image
                    width={500}
                    height={250}
                    alt="user clicked previous month"
                    src={img1}
                  />
                  <Figure.Caption>User clicked previous month.</Figure.Caption>
                </Figure>
              </Col>
              <Col lg="6">
                <Figure>
                  <Figure.Image width={540} height={250} alt="user clicked next month" src={img2} />
                  <Figure.Caption>User clicked next month.</Figure.Caption>
                </Figure>
              </Col>
            </Row>
          </Container>
          <h3 className="my-5">The transition:</h3>
          <h3 className="my-5">Render the new selected month:</h3>
        </Container>
      </main>
      <footer></footer>
    </div>
  );
};

export { App };
