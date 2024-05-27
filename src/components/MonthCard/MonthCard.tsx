import React, {
  forwardRef,
  useRef,
  useState,
  Dispatch,
  MouseEvent,
  KeyboardEvent,
  CSSProperties,
  MouseEventHandler,
} from 'react';
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
  speed: number;
  demo?: 'render2month' | 'transition' | 'renderNewMonth';
  demoWithNoKey?: boolean;
  showLabel?: boolean;
}

export type Param = ReturnType<typeof getParam>;

type Increment = 1 | -1;

type TransitionStyle = {
  [P in TransitionStatus]: CSSProperties;
};

const MonthCard: React.ForwardRefExoticComponent<
  React.RefAttributes<HTMLDivElement> & MonthCardProps
> = forwardRef(function (
  { time, setTime, setSelectedDay, speed, demo, demoWithNoKey, showLabel },
  ref
) {
  const { theme } = useTheme();

  // when activeTransition is true react render prev, current & next month needed for the animation
  const [activeTransition, setActiveTransition] = useState<boolean>(false);

  // react-transition-group Transition state
  const [inProp, setInProp] = useState<boolean>(false);

  // state to handle which month the user is toggling is previous (false) or next month (true)
  const [nextOrPrev, setNextOrPrev] = useState<boolean | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  // handle the data to display the hidden prev monthCard, current visible monthCard & the hidden next monthCard.
  const param: Param = getParam(time);
  const prevMonthTime = new Date(time).setMonth(new Date(time).getMonth() - 1);
  const nextMonthTime = new Date(time).setMonth(new Date(time).getMonth() + 1);
  const paramPrevMonth: Param = getParam(prevMonthTime);
  const paramNextMonth = getParam(nextMonthTime);

  const isDemo = demo === 'render2month' || demo === 'renderNewMonth' || demo === 'transition';

  // Toggle month theme classNames
  const togglemonth = cx({
    [`monthCard__toggleMonth--${theme}`]: true,
  });

  const togglemonth_classes = classNames(
    styles[togglemonth],
    styles[`monthCard__toggleMonth`],
    `d-flex`,
    `justify-content-between`,
    `align-items-center`
  );

  const weekDay_classes = classNames(
    styles[`monthCard__weekday--${theme}`],
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
    styles[`monthCard__icon-prevMonth--${theme}`],
    styles[
      cx({
        'monthCard__icon-prevMonth--disabled': demo === 'transition',
      })
    ]
  );

  // icon next classes
  const icon_next_classes = classNames(
    styles['monthCard__icon-nextMonth'],
    styles[`monthCard__icon-nextMonth--${theme}`]
  );

  const transition_container_classes = classNames(
    styles['monthCard__transition-container'],
    styles[`monthCard__transition-container--${theme}`]
  );

  const box_classes = classNames(
    styles['monthCard__container-box'],
    styles[`monthCard__container-box--${theme}`],
    'd-flex',
    'flex-wrap',
    'text'
  );

  const monthCard_container_classes = classNames(
    styles['monthCard__container'],
    styles[
      cx({
        'monthCard__container--visible': isDemo,
      })
    ],
    styles[
      cx({
        'monthCard__container--showLabel': showLabel,
      })
    ]
  );

  const defaultStyle: CSSProperties = {
    transition: `transform ${speed}ms ease-in-out`,
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

  const handleSelectedDay = (
    e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>,
    time: number
  ) => {
    setTime(time);
    const value = (e.target as HTMLElement).innerText;

    setSelectedDay(Number(value));
  };

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
      .map((_, i) => {
        const timeDayPrevMonth = timeFirstDay - 1000 * 60 * 60 * 24 * (i + 1);
        const weekdayPrevMonth = new Date(timeDayPrevMonth).getDate();
        return (
          <div
            aria-label={`previous-${weekdayPrevMonth}`}
            key={`prev-${i}`}
            role="button"
            className={prevAndNext_classes}
            onKeyUp={() => setTime(timeDayPrevMonth)}
            onClick={() => setTime(timeDayPrevMonth)}
            tabIndex={0}
          >
            {weekdayPrevMonth}
          </div>
        );
      })
      .reverse();
  };

  // function to render all the day from 1 to 28/29 if Feb. otherwise 30/31
  const dayInMonth = (nbDays: number, param: Param, isCurrentMonth: boolean) => {
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
            [`monthCard__day--selected-${theme}`]: isCurrentMonth && selectedDay === day + 1,
          })
        ]
      );
      return (
        <div
          aria-label={`current-${day + 1}`}
          key={`current-${i}`}
          role="button"
          className={daysInMonth_classes}
          onClick={(e) => handleSelectedDay(e, time)}
          onKeyUp={(e) => handleSelectedDay(e, time)}
          tabIndex={0}
        >
          {day + 1}
        </div>
      );
    });
  };

  // function to render all the days in next month to complete the current row in the current month
  const nextMonth = (param: Param) => {
    const { nextMonthDays, timeLastDay } = param;
    return nextMonthDays?.map((day, i) => {
      const timeDayNextMonth = timeLastDay + 1000 * 60 * 60 * 24 * (i + 1);
      return (
        <div
          aria-label={`next-${i + 1}`}
          key={`next-${i}`}
          role="button"
          className={prevAndNext_classes}
          onClick={() => setTime(timeDayNextMonth)}
          onKeyUp={() => setTime(timeDayNextMonth)}
          tabIndex={0}
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

  const handlePreviousOnClick: MouseEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();
    setActiveTransition(true);
    if (demo !== 'render2month') {
      setInProp(true);
    }
    setNextOrPrev(false);
  };

  return (
    <div ref={ref} className={monthCard_container_classes}>
      <div>
        <div className={togglemonth_classes}>
          <svg
            role="img"
            aria-labelledby="svgPrevious"
            focusable={true}
            className={icon_prev_classes}
            onClick={demo === 'transition' ? () => null : handlePreviousOnClick}
          >
            <title id="svgPrevious">Previous Month</title>
            <use href={`${sprite}#icon-triangle-left`} className="text"></use>
          </svg>
          <span data-testid="monthCard_selected_month">{`${param.fullMonth} ${param.year}`}</span>

          <svg
            role="img"
            aria-labelledby="svgNext"
            focusable={true}
            className={icon_next_classes}
            onClick={() => {
              setActiveTransition(true);
              if (demo !== 'render2month') {
                setInProp(true);
              }

              setNextOrPrev(true);
            }}
          >
            <title id="svgNext">Next Month</title>
            <use href={`${sprite}#icon-triangle-right`}> </use>
          </svg>
        </div>
        <div className={weekDay_classes}>{weekHeader}</div>
      </div>
      <div className={transition_container_classes}>
        <Transition
          in={inProp}
          timeout={{
            exit: speed,
          }}
          nodeRef={nodeRef}
          onEntered={() => {
            setInProp(false);
          }}
          onExited={() => {
            if (demo !== 'transition') {
              handleToggleMonth(nextOrPrev ? 1 : -1);
            }
          }}
        >
          {(state) => {
            const toggledMonthParam = nextOrPrev ? paramNextMonth : paramPrevMonth;
            return (
              <div
                id="monthCard_transition_ref"
                key={demoWithNoKey ? 1 : time}
                className={`d-flex flex-row${nextOrPrev ? '' : '-reverse'}`}
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
                ref={nodeRef}
              >
                <div className={box_classes}>
                  {param && param.weekDayFirstOfMonth >= 0 && prevMonth(param)}
                  {dayInMonth(param.numberOfDayInMonth, param, true)}
                  {nextMonth(param)}
                </div>
                {activeTransition && (
                  <div className={box_classes}>
                    {toggledMonthParam &&
                      toggledMonthParam.weekDayFirstOfMonth >= 0 &&
                      prevMonth(toggledMonthParam)}
                    {dayInMonth(toggledMonthParam.numberOfDayInMonth, toggledMonthParam, false)}
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
