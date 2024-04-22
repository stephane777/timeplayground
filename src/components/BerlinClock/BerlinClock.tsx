import React, { useState, useEffect, FC } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import styles from './BerlinClock.module.scss';
const cx = classNames.bind(styles);

interface BerlinClockProps {
  time: string; // 15:45:06
}

interface BerlinClockState {
  second: 'Y' | 'O';
  fiveHoursCell: Array<'R' | 'O'>;
  hours: Array<'R' | 'O'>;
  fiveMinutesCell: Array<'R' | 'Y' | 'O'>;
  minutes: Array<'Y' | 'O'>;
}

function convertTime(time: string): BerlinClockState {
  let [h, m, s] = time.split(':').map(Number);

  return {
    second: s % 2 ? 'O' : 'Y',
    fiveHoursCell: Array.from({ length: 4 })
      .fill('O')
      .map((_, index) => {
        return h >= (index + 1) * 5 ? 'R' : 'O';
      }),
    hours: Array.from({ length: 4 })
      .fill('O')
      .map((_, index) => {
        return h % 5 >= index + 1 ? 'R' : 'O';
      }),
    fiveMinutesCell: Array.from({ length: 11 })
      .fill('O')
      .map((_, index) => {
        const total = (index + 1) * 5;
        return m >= (index + 1) * 5 ? (total % 15 === 0 ? 'R' : 'Y') : 'O';
      }),
    minutes: Array.from({ length: 4 })
      .fill('O')
      .map((_, index) => {
        return m % 5 >= index + 1 ? 'Y' : 'O';
      }),
  };
}

const BerlinClock: FC<BerlinClockProps> = ({ time }) => {
  const [state, setState] = useState<BerlinClockState>(() => convertTime(time));
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTime = convertTime(moment().format('HH:mm:ss'));

      setState(newTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const second_classes = classNames(
    styles['berlinClock__second'],
    styles[
      cx({
        [`berlinClock__second--${state.second}`]: true,
      })
    ]
  );

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
      {/** SECOND*/}
      <div className={second_classes}></div>
      <div className={styles['berlinClock__join']}></div>
      {/** hours cell 5h*/}
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell cells={state.fiveHoursCell} />
      </div>
      {/** hours cell 1h*/}
      <div className={styles['berlinClock__join']}></div>
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell cells={state.hours} />
      </div>
      {/** minutes cell 5min*/}
      <div className={styles['berlinClock__join']}></div>
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell cells={state.fiveMinutesCell} />
      </div>
      {/** minutes cell 1min*/}
      <div className={styles['berlinClock__join']}></div>
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell cells={state.minutes} />
      </div>
      <span className={styles['berlinClock__time']}>{moment().format('HH:mm:ss')}</span>
    </div>
  );
};

const BuildCell: FC<{ cells: Array<'Y' | 'R' | 'O'> }> = ({ cells }) => {
  return cells.map((cell, index) => {
    const cell_classNames = classNames(
      styles['berlinClock__row-cell'],
      styles[
        cx({
          [`berlinClock__row-cell--${cell}`]: true,
        })
      ]
    );
    return <div key={index} className={cell_classNames}></div>;
  });
};
export default BerlinClock;
