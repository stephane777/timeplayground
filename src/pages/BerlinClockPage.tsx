import React, { FC } from 'react';
import BerlinClock from '../components/BerlinClock/BerlinClock';
import styles from '../components/App/App.module.scss';
import styles2 from '../components/BerlinClock/BerlinClock.module.scss';
import Container from 'react-bootstrap/Container';

const BerlinClockPage: FC = () => {
  return (
    <section className={styles2['berlinClock__container']}>
      <Container fluid="sm" className="pt-5">
        <h1 className="">Berlin Clock</h1>
        <div className={styles[`container__datePicker`]}>
          <BerlinClock time={'17:28:04'} />
        </div>
      </Container>
    </section>
  );
};

export default BerlinClockPage;
