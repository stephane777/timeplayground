import React, { FC } from 'react';
import { BerlinClock } from '../../components/BerlinClock';
// import styles from '../../components/App/App.module.scss';
import styles from './BerlinClockPage.module.scss';
// import styles2 from '../../components/BerlinClock/BerlinClock.module.scss';
import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';
import { useTheme } from '../../context/themeContext';

const BerlinClockPage: FC = () => {
  const { theme } = useTheme();
  return (
    <Container fluid="sm" className={styles['berlinClockPage__wrapper']}>
      <section className="mt-0">
        <h1 className="">Berlin Clock</h1>
        <div className={styles['berlinClockPage__container']}>
          <BerlinClock time={'17:28:04'} />
        </div>
      </section>

      <section>
        <h2 className="mt-7 mb-5">Overview:</h2>I came accross the <em>Berlin Clock</em> or &nbsp;
        <Button
          data-bs-theme={theme}
          className="p-0 text-decoration-none border-0 align-baseline"
          variant="link"
          href="https://en.wikipedia.org/wiki/Mengenlehreuhr"
        >
          Mengenlehreuhr
        </Button>{' '}
        while solving a kata&apos;s in &nbsp;
        <Button
          data-bs-theme={theme}
          className="p-0 text-decoration-none border-0 align-baseline"
          variant="link"
          href="https://www.codewars.com/dashboard"
        >
          code wars
        </Button>{' '}
        and I thought it would be fun to build it.
        <br /> It&apos;s a simple and easy project to play around with timezone from&nbsp;
        <Button
          data-bs-theme={theme}
          className="p-0 text-decoration-none border-0 align-baseline"
          variant="link"
          href="https://momentjs.com/timezone/"
        >
          timezone moment.js
        </Button>
        . Here is the&nbsp;
        <Button
          data-bs-theme={theme}
          className="p-0 text-decoration-none border-0 align-baseline"
          variant="link"
          href="https://www.codewars.com/kata/5a1463678ba9145a670000f9"
        >
          kata&apos;s link
        </Button>{' '}
        whether you want to solve it.
        <br /> I&apos;ve added 2 dropdowns so we can chose any timezone and see the time with the
        Berlin clock.
      </section>
    </Container>
  );
};

export default BerlinClockPage;
