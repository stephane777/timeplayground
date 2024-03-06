import React, { forwardRef, ComponentPropsWithRef, ReactNode } from 'react';
import styles from './MonthCard.module.scss';
// import sprite from '../assets/img/sprite.svg';
import sprite from '../../assets/img/svg/sprite.svg';

const MonthCard: React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement>> = forwardRef(
  function ({}, ref) {
    // function to render weekdays in the header
    const weekHeader = () => {
      const dayList = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
      return dayList.map((day, i) => (
        <div key={`${day}-${i}`} className={`grid__day${i}`}>
          {day}
        </div>
      ));
    };

    return (
      <div ref={ref} className={styles['monthCard__container']}>
        <div className="d-flex justify-content-between">
          <svg className={styles['monthCard__icon-prevMonth']} onClick={() => null}>
            <use href={`${sprite}#icon-triangle-left`}></use>
          </svg>
          <span>Month Year</span>
          <svg className={styles['monthCard__icon-nextMonth']} onClick={() => null}>
            <use href={`${sprite}#icon-triangle-right`}> </use>
          </svg>
        </div>
        <div className="d-flex gap-2">{weekHeader()}</div>
      </div>
    );
  }
);

export default MonthCard;
