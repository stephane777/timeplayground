import React, { FC } from 'react';
import { useTheme } from '../../context/themeContext';
// import { CopyBlock, hybrid } from 'react-code-blocks';
import DateRange from '../../components/DateRange/DateRange';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// import Button from 'react-bootstrap/Button';
// import Badge from 'react-bootstrap/Badge';
// import Figure from 'react-bootstrap/Figure';
// import img2 from '../../assets/img/png/MonthCard_Next.png';
// import img1 from '../../assets/img/png/MonthCard_prev.png';

import styles from './DateRangePage.module.scss';
import { Badge } from 'react-bootstrap';

const DateRangePage: FC = () => {
  const { theme } = useTheme();
  return (
    <>
      <Container fluid="sm" className={styles[`dateRangePage__wrapper`]}>
        <section className="mt-0">
          <h1 className="">Date Range</h1>
          <div className={styles[`dateRangePage__container`]}>
            <div className="my-7">
              <DateRange speed={500} disablePastDay highlightToday />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mt-7 mb-5">Overview:</h2>
          The date range picker is very similar to the date picker with few more feature. The goal
          is to ease user experience
          <br /> for selecting 2 dates and see the duration visually. I&apos;ve added some options
          like disabling past days,
          <br /> highlighting today&apos;s date and a date prop in order to force the initial month
          in the dropdown.
          <br /> This date range picker use date manipulation a lot and I found using&nbsp;
          <Button
            data-bs-theme={theme}
            className="p-0 text-decoration-none border-0 align-baseline"
            variant="link"
            href="https://momentjs.com/docs/"
          >
            moment.js
          </Button>{' '}
          definitely easier.
        </section>
        <section>
          <h2 className="mt-7 mb-5">Date range with default props:</h2>
          <Row>
            <Col lg={4} className="d-flex align-items-center">
              <div className="flex-grow-1">
                <DateRange speed={500} />
              </div>
            </Col>
            <Col lg={8}>
              By default most of date range shows the current month as 1st month on the left, then{' '}
              <br />
              next month on its right side. Similar to the date picker when the user navigates
              between month the first step is to render a third month aside the 2 already rendered
              depending on the direction next or previous. Of course this third month is hidden at
              this stage. Then the Transition kicks off. At the end of the transition a state update
              with the new current month will show. <br />
              As long as you click a past day it will be considered as the start date. If a start
              and end are already selected a new click will reset the duration and set the new date
              as start date.
            </Col>
          </Row>
        </section>
        <section>
          <h2 className="mt-7 mb-5">Date range with disabled day & today highlighted:</h2>
          <Row>
            <Col lg={4} className="d-flex align-items-center">
              <div className="flex-grow-1">
                <DateRange speed={500} highlightToday disablePastDay />
              </div>
            </Col>
            <Col lg={8}>
              If today is selected as start date it will behave as any another day with the normmal
              color. All past days are disabled to select. When a start and end date are selected
              the duration count should appear as information. Once finished to select a range{' '}
              <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                Done
              </Badge>{' '}
              button close the dropdown. <br />
              If no start date are selected a click to{' '}
              <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                Today
              </Badge>{' '}
              will set the start date as today, regardless where you are in the navigation, for
              example 4 month ahead from now.
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
};

export default DateRangePage;
