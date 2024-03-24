import React, {
  forwardRef,
  useRef,
  useState,
  Dispatch,
  MouseEventHandler,
  MouseEvent,
  ReactElement,
} from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';
import styles from './MonthCard.module.scss';
// import sprite from '../assets/img/sprite.svg';
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

  //
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

  const defaultStyle = {
    transition: `transform ${500}ms ease-in-out`,
    transform: 'translateX(0)',
  };

  const transitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered: { transform: 'translateX(0)' },
    exiting: { transform: `translateX(${nextOrPrev ? '-33%' : '33%'})` },
    exited: { transform: 'translateX(0)' },
    unmounted: { transform: 'translateX(0)' },
  };

  const handleSelectedDay = (e: MouseEvent<HTMLElement>, time: number) => {
    setTime(time);
    const value = (e.target as HTMLElement).innerText;
    setSelectedDay(Number(value));
  };

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
  const prevMonth = (param: Param) => {
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
  const nextMonth = (param: Param) => {
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

  const handleGoToPreviousMonth = () => {
    const { month, year } = param;

    // if month = 01 or 12 year will be incremented or decremented
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? Number(year) - 1 : year;
    const time = getTimeFromDate('01', String(previousMonth), String(previousYear));
    setTime(time);
    setActiveTransition(false);
  };

  const handleGoToNextMonth = () => {
    const { month, year } = param;

    // if month = 01 or 12 year will be incremented or decremented
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? Number(year) + 1 : year;
    const time = getTimeFromDate('01', String(nextMonth), String(nextYear));
    setTime(time);
    setActiveTransition(false);
  };

  // const monthCardHeaderActive_classes = cx({
  //   'col-4': activeTransition,
  //   'offset-4': activeTransition,
  // });

  const monthCardActiveContainer_classes = classNames(
    styles['monthCard__container'],
    styles[
      cx({
        'monthCard__container--active': activeTransition,
      })
    ]
  );

  return (
    <div ref={ref} className={monthCardActiveContainer_classes}>
      <div>
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
          <div className={weekDay_classes}>{weekHeader()}</div>
        </div>
      </div>
      <div style={{ width: '204px', height: '250px', overflow: 'visible', position: 'relative' }}>
        <Transition
          in={inProp}
          timeout={{
            exit: 500,
          }}
          nodeRef={nodeRef}
          onEntered={() => {
            setInProp(false);
          }}
          onExited={() => {
            if (nextOrPrev) {
              handleGoToNextMonth();
            } else {
              handleGoToPreviousMonth();
            }
          }}
        >
          {(state) => {
            return (
              <div
                key={time}
                className="d-flex"
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                  ...{ position: 'absolute', top: '0px', left: activeTransition ? '-204px' : '0' },
                }}
                ref={nodeRef}
              >
                {activeTransition && (
                  <div className={box_classes}>
                    {paramPrevMonth &&
                      paramPrevMonth.weekDayFirstOfMonth >= 0 &&
                      prevMonth(paramPrevMonth)}
                    {dayInMonth(paramPrevMonth.numberOfDayInMonth, paramPrevMonth)}
                    {nextMonth(paramPrevMonth)}
                  </div>
                )}
                <div className={box_classes}>
                  {param && param.weekDayFirstOfMonth >= 0 && prevMonth(param)}
                  {dayInMonth(param.numberOfDayInMonth, param)}
                  {nextMonth(param)}
                </div>
                {activeTransition && (
                  <div className={box_classes}>
                    {paramNextMonth &&
                      paramNextMonth.weekDayFirstOfMonth >= 0 &&
                      prevMonth(paramNextMonth)}
                    {dayInMonth(paramNextMonth.numberOfDayInMonth, paramNextMonth)}
                    {nextMonth(paramNextMonth)}
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
