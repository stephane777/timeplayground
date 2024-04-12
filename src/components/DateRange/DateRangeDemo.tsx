import React, { FC, ReactNode } from 'react';
import { CopyBlock, hybrid } from 'react-code-blocks';
import DateRange from './DateRange';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Figure from 'react-bootstrap/Figure';
import img2 from '../../assets/img/png/MonthCard_Next.png';
import img1 from '../../assets/img/png/MonthCard_prev.png';
import styles from '../App/App.module.scss';

const DatePickerDemo: FC = () => {
  return (
    <>
      <section>
        <h1 className="">Date Picker</h1>
        <div className={styles[`container__datePicker`]}>
          <DateRange speed={300} />
        </div>
      </section>
    </>
  );
};

export default DatePickerDemo;
