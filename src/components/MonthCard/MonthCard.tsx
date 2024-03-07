import React, {
  forwardRef,
  ComponentPropsWithRef,
  ReactNode,
  Dispatch,
  EventHandler,
  MouseEventHandler,
} from 'react';
import styles from './MonthCard.module.scss';
// import sprite from '../assets/img/sprite.svg';
import sprite from '../../assets/img/svg/sprite.svg';
import classNames from 'classnames';
const cx = classNames.bind(styles);
import { getParam, getTimeFromDate } from '../../utils';

interface MonthCardProps {
  time: number;
  setTime: Dispatch<React.SetStateAction<number>>;
  isPrev?: boolean;
  isNext?: boolean;
}

const MonthCard: React.ForwardRefExoticComponent<
  React.RefAttributes<HTMLDivElement> & MonthCardProps
> = forwardRef(function ({ time, setTime, isPrev, isNext }, ref) {
  const param = getParam(time);

  // Toggle month classNames
  const togglemonth_classes = classNames(
    styles[`monthCard__toggleMonth`],
    `d-flex`,
    `justify-content-between`,
    `align-items-center`
  );

  // previous Day in month classNames
  const prevAndNext_classes = classNames(
    styles[`monthCard__day`],
    styles[`monthCard__day--prevMonth`]
  );

  // all the day in month classNames
  const daysInMonth_classes = classNames(styles[`monthCard__day`]);

  // function to render weekdays in the header
  const weekHeader = () => {
    const dayList = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return dayList.map((day, i) => (
      <div key={`${day}-${i}`} className={styles['monthCard__weekday']}>
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

  // function to render all the day from 1 to 30/31
  const dayInMonth = (nbDays: number) => {
    const arrayLength = { length: nbDays };
    const monthArr = Array.from(arrayLength, (v, i) => i);
    const { timeFirstDay, day: selectedDay } = param;

    return monthArr.map((day, i) => {
      const time = timeFirstDay + 1000 * 60 * 60 * 24 * i;

      return (
        <div key={`${day}-${i}`} className={daysInMonth_classes} onClick={() => setTime(time)}>
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
        <svg className={styles['monthCard__icon-prevMonth']} onClick={handleGoToPreviousMonth}>
          <use href={`${sprite}#icon-triangle-left`}></use>
        </svg>
        <span>{`${param.fullMonth} ${param.year}`}</span>
        <svg className={styles['monthCard__icon-nextMonth']} onClick={handleGoToNextMonth}>
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
