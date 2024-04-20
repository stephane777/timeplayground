import React, { FC, ReactNode } from 'react';
import { CopyBlock, hybrid } from 'react-code-blocks';
import DateRange from '../components/DateRange/DateRange';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Figure from 'react-bootstrap/Figure';
import img2 from '../../assets/img/png/MonthCard_Next.png';
import img1 from '../../assets/img/png/MonthCard_prev.png';
import styles from '../components/DateRange/DateRange.module.scss';

const DateRangePage: FC = () => {
  return (
    <>
      <section>
        <Container fluid="sm" className="pt-5">
          <h1 className="">Date Range</h1>

          <div className={styles[`dateRange__container`]}>
            <DateRange speed={500} disablePastDay highlightToday />
          </div>
        </Container>
      </section>
    </>
  );
};

export default DateRangePage;
