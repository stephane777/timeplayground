import React, { forwardRef, useState, Dispatch, MouseEventHandler, MouseEvent } from 'react';
import styles from './MonthCard.module.scss';
// import sprite from '../assets/img/sprite.svg';
import sprite from '../../assets/img/svg/sprite.svg';
import classNames from 'classnames';
import { useTheme } from '../../context/themeContext';
const cx = classNames.bind(styles);
import { getParam, getTimeFromDate } from '../../utils';

interface MonthCardProps {
  time: number;
  setTime: Dispatch<React.SetStateAction<number>>;
  selectedDay: number | null;
  setSelectedDay: Dispatch<React.SetStateAction<number | null>>;
  isPrev?: boolean;
  isNext?: boolean;
}

const MonthCard: React.ForwardRefExoticComponent<
  React.RefAttributes<HTMLDivElement> & MonthCardProps
> = forwardRef(function ({ time, setTime, selectedDay, setSelectedDay, isPrev, isNext }, ref) {
  const param = getParam(time);
  const { theme } = useTheme();

  // Toggle month theme classNames
  const togglemonth = cx({
    'monthCard__toggleMonth--dark': theme === 'dark',
    'monthCard__toggleMonth--light': theme === 'light',
  });

  //
  const togglemonth_classes = classNames(
    styles[togglemonth],
    `d-flex`,
    `justify-content-between`,
    `align-items-center`
  );

  const monthDay_classes = classNames(
    styles['monthCard__weekday'],
    styles[
      cx({
        'monthCard__weekday--light': theme === 'light',
        'monthCard__weekday--dark': theme === 'dark',
      })
    ]
  );

  // previous Day in month classNames
  const prevAndNext_classes = classNames(
    styles[`monthCard__day`],
    styles[`monthCard__day--prevNextMonth`]
  );

  // icon prev classes
  const icon_prev_classes = classNames(
    styles['monthCard__icon-prevMonth'],
    styles[
      cx({
        'monthCard__icon-prevMonth--light': theme === 'light',
        'monthCard__icon-prevMonth--dark': theme === 'dark',
      })
    ]
  );

  // icon next classes
  const icon_next_classes = classNames(
    styles['monthCard__icon-nextMonth'],
    styles[
      cx({
        'monthCard__icon-nextMonth--light': theme === 'light',
        'monthCard__icon-nextMonth--dark': theme === 'dark',
      })
    ]
  );

  const handleSelectedDay = (e: MouseEvent<HTMLElement>, time: number) => {
    setTime(time);
    const value = (e.target as HTMLElement).innerText;
    setSelectedDay(Number(value));
  };

  // function to render weekdays in the header
  const weekHeader = () => {
    const dayList = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return dayList.map((day, i) => (
      <div key={`${day}-${i}`} className={monthDay_classes}>
        {day}
      </div>
    ));
  };

  // get all the day from the previous Month
  const prevMonth = () => {
    const { prevMonthDays, timeFirstDay } = param;
    return prevMonthDays
      .map((day, i) => {
        const timeDayPrevMonth = timeFirstDay - 1000 * 60 * 60 * 24 * (i + 1);
        const weekdayPrevMonth = new Date(timeDayPrevMonth).getDate();
        return (
          <div
            key={`${day}-${i}`}
            className={prevAndNext_classes}
            onClick={() => setTime(timeDayPrevMonth)}
          >
            {weekdayPrevMonth}
          </div>
        );
      })
      .reverse();
  };

  // function to render all the day from 1 to 28/29 if Feb. otherwise 30/31
  const dayInMonth = (nbDays: number) => {
    const arrayLength = { length: nbDays };
    const monthArr = Array.from(arrayLength, (v, i) => i);
    console.log('monthArr: ', monthArr);
    const { timeFirstDay, day: selectedDay } = param;

    return monthArr.map((day, i) => {
      const time = timeFirstDay + 1000 * 60 * 60 * 24 * i;
      // all the day in month classNames
      const daysInMonth_classes = classNames(
        styles[`monthCard__day`],
        styles[
          cx({
            'monthCard__day--selected-light': theme === 'light' && selectedDay === day + 1,
            'monthCard__day--selected-dark': theme === 'dark' && selectedDay === day + 1,
          })
        ]
      );
      return (
        <div
          key={`${day}-${i}`}
          className={daysInMonth_classes}
          onClick={(e) => handleSelectedDay(e, time)}
        >
          {day + 1}
        </div>
      );
    });
  };

  // function to render all the days in next month to complete the current row in the current month
  const nextMonth = () => {
    const { nextMonthDays, timeLastDay } = param;
    if (!nextMonthDays) return;
    return nextMonthDays.map((day, i) => {
      const timeDayNextMonth = timeLastDay + 1000 * 60 * 60 * 24 * (i + 1);
      return (
        <div
          key={`${day}-${i}`}
          className={prevAndNext_classes}
          onClick={() => setTime(timeDayNextMonth)}
        >
          {i + 1}
        </div>
      );
    });
  };

  const handleGoToPreviousMonth: MouseEventHandler<HTMLOrSVGElement> = () => {
    const { month, year } = param;

    // if month = 01 or 12 year will be incremented or decremented
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? Number(year) - 1 : year;
    const time = getTimeFromDate('01', String(previousMonth), String(previousYear));
    setTime(time);
  };
  const handleGoToNextMonth: MouseEventHandler<HTMLOrSVGElement> = () => {
    const { month, year } = param;

    // if month = 01 or 12 year will be incremented or decremented
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? Number(year) + 1 : year;
    const time = getTimeFromDate('01', String(nextMonth), String(nextYear));
    setTime(time);
  };

  return (
    <div ref={ref} className={styles['monthCard__container']}>
      <div className={togglemonth_classes}>
        <svg className={icon_prev_classes} onClick={handleGoToPreviousMonth}>
          <use href={`${sprite}#icon-triangle-left`}></use>
        </svg>
        <span>{`${param.fullMonth} ${param.year}`}</span>
        <svg className={icon_next_classes} onClick={handleGoToNextMonth}>
          <use href={`${sprite}#icon-triangle-right`}> </use>
        </svg>
      </div>
      <div className={'d-flex justify-content-center'}>{weekHeader()}</div>
      {/* <div className="d-flex flex-row"> */}
      {/* <div className="d-flex flex-wrap text">
          {param && param.weekDayFirstOfMonth >= 0 && prevMonth()}
          {dayInMonth(param.numberOfDayInMonth)}
          {nextMonth()}
        </div> */}
      <div className="d-flex flex-wrap text">
        {param && param.weekDayFirstOfMonth >= 0 && prevMonth()}
        {dayInMonth(param.numberOfDayInMonth)}
        {nextMonth()}
      </div>
      {/* <div className="d-flex flex-wrap text">
          {param && param.weekDayFirstOfMonth >= 0 && prevMonth()}
          {dayInMonth(param.numberOfDayInMonth)}
          {nextMonth()}
        </div> */}
      {/* </div> */}
    </div>
  );
});

export default MonthCard;
