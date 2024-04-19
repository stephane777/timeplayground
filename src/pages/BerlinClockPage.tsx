import React, { FC } from 'react';
import BerlinClock from '../components/BerlinClock/BerlinClock';
import styles from '../components/App/App.module.scss';

const BerlinClockPage: FC = () => {
  return (
    <section>
      <h1 className="">Berlin Clock</h1>
      <div className={styles[`container__datePicker`]}>
        <BerlinClock time={'12:56:01'} />
      </div>
    </section>
  );
};

export default BerlinClockPage;
