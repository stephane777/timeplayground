import React, { forwardRef, useRef, useState, Dispatch, MouseEvent, CSSProperties } from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';
import styles from './MonthCard.module.scss';
import sprite from '../../assets/img/svg/sprite.svg';
import classNames from 'classnames';
import { useTheme } from '../../context/themeContext';
import { getParam, getTimeFromDate } from '../../utils';

const cx = classNames.bind(styles);

interface MonthCardProps {
  time: number;
  setTime: Dispatch<React.SetStateAction<number>>;
  selectedDay: number | null;
  setSelectedDay: Dispatch<React.SetStateAction<number | null>>;
}

type Param = ReturnType<typeof getParam>;

type Increment = 1 | -1;

type TransitionStyle = {
  [P in TransitionStatus]: CSSProperties;
};

const MonthCard: React.ForwardRefExoticComponent<
  React.RefAttributes<HTMLDivElement> & MonthCardProps
> = forwardRef(function ({ time, setTime, selectedDay, setSelectedDay }, ref) {
  const { theme } = useTheme();

  // when activeTransition is true react render prev, current & next month needed for the animation
  const [activeTransition, setActiveTransition] = useState<boolean>(false);

  // react-transition-group Transition state
  const [inProp, setInProp] = useState<boolean>(false);

  // state to handle which month the user is toggling is previous or next month
  const [nextOrPrev, setNextOrPrev] = useState<boolean | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  // handle the data to display the hidden prev monthCard, current visible monthCard & the hidden next monthCard.
  const param = getParam(time);
  const prevMonthTime = new Date(time).setMonth(new Date(time).getMonth() - 1);
  const nextMonthTime = new Date(time).setMonth(new Date(time).getMonth() + 1);
  const paramPrevMonth = getParam(prevMonthTime);
  const paramNextMonth = getParam(nextMonthTime);

  // Toggle month theme classNames
  const togglemonth = cx({
    'monthCard__toggleMonth--dark': theme === 'dark',
    'monthCard__toggleMonth--light': theme === 'light',
  });

  const togglemonth_classes = classNames(
    styles[togglemonth],
    styles[`monthCard__toggleMonth`],
    `d-flex`,
    `justify-content-between`,
    `align-items-center`
  );

  const weekDay_classes = classNames(
    styles[
      cx({
        'monthCard__weekday--light': theme === 'light',
        'monthCard__weekday--dark': theme === 'dark',
      })
    ],
    'd-flex',
    'justify-content-center'
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

  const box_classes = classNames(styles['monthCard__container-box'], 'd-flex', 'flex-wrap', 'text');

  const defaultStyle: CSSProperties = {
    transition: `transform ${300}ms ease-in-out`,
    transform: 'translateX(0)',
    position: 'absolute',
    top: '0',
    left: nextOrPrev && activeTransition ? '0' : !nextOrPrev && activeTransition ? '-204px' : '0',
  };

  const transitionStyles: TransitionStyle = {
    entering: { transform: 'translateX(0)' },
    entered: { transform: 'translateX(0)' },
    exiting: { transform: `translateX(${nextOrPrev ? '-50%' : '50%'})` },
    exited: { transform: 'translateX(0)' },
    unmounted: { transform: 'translateX(0)' },
  };

  const handleSelectedDay = React.useCallback(
    (e: MouseEvent<HTMLElement>, time: number) => {
      setTime(time);
      const value = (e.target as HTMLElement).innerText;
      setSelectedDay(Number(value));
    },
    [time]
  );

  // function to render weekdays in the header
  const weekHeader = React.useMemo(() => {
    const dayList = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return dayList.map((day, i) => (
      <div key={`${day}-${i}`} className={styles['monthCard__weekday']}>
        {day}
      </div>
    ));
  }, []);

  // get all the day from the previous Month
  const prevMonth = (param: Param) => {
    const { prevMonthDays, timeFirstDay } = param;
    return prevMonthDays
      .map((day, i) => {
        const timeDayPrevMonth = timeFirstDay - 1000 * 60 * 60 * 24 * (i + 1);
        const weekdayPrevMonth = new Date(timeDayPrevMonth).getDate();
        return (
          <div
            key={`prev-${i}`}
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
  const dayInMonth = (nbDays: number, param: Param) => {
    const arrayLength = { length: nbDays };
    const monthArr = Array.from(arrayLength, (v, i) => i);
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
          key={`current-${i}`}
          className={daysInMonth_classes}
          onClick={(e) => handleSelectedDay(e, time)}
        >
          {day + 1}
        </div>
      );
    });
  };

  // function to render all the days in next month to complete the current row in the current month
  const nextMonth = (param: Param) => {
    const { nextMonthDays, timeLastDay } = param;
    if (!nextMonthDays) return;
    return nextMonthDays.map((day, i) => {
      const timeDayNextMonth = timeLastDay + 1000 * 60 * 60 * 24 * (i + 1);
      return (
        <div
          key={`next-${i}`}
          className={prevAndNext_classes}
          onClick={() => setTime(timeDayNextMonth)}
        >
          {i + 1}
        </div>
      );
    });
  };

  const handleToggleMonth = (increment: Increment) => {
    const { month, year } = param;

    // if month = 01 or 12 year will be incremented or decremented
    const newMonth = month === 1 ? 12 : month + increment;
    const newYear = month === 1 ? Number(year) + increment : year;
    const time = getTimeFromDate('01', String(newMonth), String(newYear));
    setTime(time);
    setActiveTransition(false);
  };

  return (
    <div ref={ref} className={styles['monthCard__container']}>
      <div>
        <div className={togglemonth_classes}>
          <svg
            className={icon_prev_classes}
            onClick={() => {
              setActiveTransition(true);
              setInProp(true);
              setNextOrPrev(false);
            }}
          >
            <use href={`${sprite}#icon-triangle-left`} className="text"></use>
          </svg>
          <span>{`${param.fullMonth} ${param.year}`}</span>

          <svg
            className={icon_next_classes}
            onClick={() => {
              setActiveTransition(true);
              setInProp(true);
              setNextOrPrev(true);
            }}
          >
            <use href={`${sprite}#icon-triangle-right`}> </use>
          </svg>
        </div>
        <div className={weekDay_classes}>{weekHeader}</div>
      </div>
      <div className={styles['monthCard__transition-container']}>
        <Transition
          in={inProp}
          timeout={{
            exit: 300,
          }}
          nodeRef={nodeRef}
          onEntered={() => {
            setInProp(false);
          }}
          onExited={() => {
            handleToggleMonth(nextOrPrev ? 1 : -1);
          }}
        >
          {(state) => {
            const toggledMonthParam = nextOrPrev ? paramNextMonth : paramPrevMonth;
            return (
              <div
                key={time}
                className={`d-flex flex-row${nextOrPrev ? '' : '-reverse'}`}
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
                ref={nodeRef}
              >
                <div className={box_classes}>
                  {param && param.weekDayFirstOfMonth >= 0 && prevMonth(param)}
                  {dayInMonth(param.numberOfDayInMonth, param)}
                  {nextMonth(param)}
                </div>
                {activeTransition && (
                  <div className={box_classes}>
                    {toggledMonthParam &&
                      toggledMonthParam.weekDayFirstOfMonth >= 0 &&
                      prevMonth(toggledMonthParam)}
                    {dayInMonth(toggledMonthParam.numberOfDayInMonth, toggledMonthParam)}
                    {nextMonth(toggledMonthParam)}
                  </div>
                )}
              </div>
            );
          }}
        </Transition>
      </div>
    </div>
  );
});

export default MonthCard;
