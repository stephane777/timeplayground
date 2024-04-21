import React, { FC } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import styles from './BerlinClock.module.scss';
const cx = classNames.bind(styles);

interface BerlinClockProps {
  time: string; // 15:45:06
}

// function berlinClock(time) {
//   let [h, m, s] = time.match(/\d+/g).map(x=>+x)
//   return [
//     s % 2 ? 'O' : 'Y',
//     'R'.repeat(h / 5 | 0).padEnd(4, 'O'),
//     'R'.repeat(h % 5).padEnd(4, 'O'),
//     'Y'.repeat(m / 5 | 0).replace(/(..)./g, '$1R').padEnd(11, 'O'),
//     'Y'.repeat(m % 5).padEnd(4, 'O')
//   ].join('\n')
// }

const BerlinClock: FC<BerlinClockProps> = ({ time }) => {
  const repeatChar = (
    char: 'R' | 'Y',
    time: number,
    operator: 'divide' | 'modulo',
    unit: number,
    perRow: number
  ) => {
    return (
      char.repeat(Math.floor(operator === 'divide' ? time / unit : time % unit)) +
      'O'.repeat(perRow - Math.floor(operator === 'divide' ? time / unit : time % unit))
    );
  };

  const berlinClock = (time: string) => {
    const [h, m, s] = time.split(':').map(Number);
    const firstRow = s % 2 === 0 ? 'Y' : 'O';
    const secondRow = repeatChar('R', h, 'divide', 5, 4);
    const thirdRow = repeatChar('R', h, 'modulo', 5, 4);
    const forthRow_temp = repeatChar('Y', m, 'divide', 5, 11);
    const forthRow = Array.from(forthRow_temp)
      .map((light, i) => ([3, 6, 9].includes(i + 1) && light === 'Y' ? 'R' : light))
      .join('');

    // const fifthRow = 'Y'.repeat(Math.floor(minutes % 5)) + 'O'.repeat(4 - Math.floor(minutes % 5));
    const fifthRow = repeatChar('Y', m, 'modulo', 5, 4);
    return {
      h,
      m,
      s,
      firstRow,
      secondRow,
      thirdRow,
      forthRow,
      fifthRow,
      result: `${firstRow}\n${secondRow}\n${thirdRow}\n${forthRow}\n${fifthRow}`,
    };
  };
  const result = berlinClock(time);
  console.log('result:', result);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
      {/* <pre>
        <code>{JSON.stringify(result)}</code>
      </pre> */}
      {/** SECOND*/}
      <div className={styles['berlinClock__second']}></div>
      <div className={styles['berlinClock__join']}></div>
      {/** hours cell 5h*/}
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell numberOfCells={4} />
      </div>
      {/** hours cell 1h*/}
      <div className={styles['berlinClock__join']}></div>
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell numberOfCells={4} />
      </div>
      {/** minutes cell 5min*/}
      <div className={styles['berlinClock__join']}></div>
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell numberOfCells={11} />
      </div>
      {/** minutes cell 1min*/}
      <div className={styles['berlinClock__join']}></div>
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell numberOfCells={4} />
      </div>
    </div>
  );
};

const BuildCell = ({ numberOfCells }: { numberOfCells: number }) => {
  return Array.from({ length: numberOfCells })
    .fill(1)
    .map((cell) => {
      return (
        <>
          <div className={styles['berlinClock__row-cell']}></div>
        </>
      );
    });
};
export default BerlinClock;
