import React, {
  forwardRef,
  useRef,
  useState,
  Dispatch,
  MouseEvent,
  MouseEventHandler,
  CSSProperties,
  SetStateAction,
} from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';
import styles from './RangeCard.module.scss';
import sprite from '../../assets/img/svg/sprite.svg';
import classNames from 'classnames';
import { useTheme } from '../../context/themeContext';
import { getParam } from '../DateRange/utils';
import moment from 'moment';
const cx = classNames.bind(styles);

interface RangeCardProps {
  currentMonth: string;
  setCurrentMonth: Dispatch<SetStateAction<string>>;
  startTime: string | null;
  setStartTime: Dispatch<SetStateAction<string | null>>;
  endTime: string | null;
  setEndTime: Dispatch<SetStateAction<string | null>>;
  speed: number;
  demo?: 'render2month' | 'transition' | 'renderNewMonth';
  demoWithNoKey?: boolean;
}

type Param = ReturnType<typeof getParam>;

type Increment = 1 | -1;

type TransitionStyle = {
  [P in TransitionStatus]: CSSProperties;
};

const RangeCard: React.ForwardRefExoticComponent<
  React.RefAttributes<HTMLDivElement> & RangeCardProps
> = forwardRef(function (
  {
    currentMonth,
    setCurrentMonth,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    speed,
    demo,
    demoWithNoKey,
  },
  ref
) {
  const { theme } = useTheme();

  // when activeTransition is true react render prev, current & next month needed for the animation
  const [activeTransition, setActiveTransition] = useState<boolean>(false);

  // react-transition-group Transition state
  const [inProp, setInProp] = useState<boolean>(false);

  // state to handle which month the user is toggling is previous (false) or next month (true)
  const [nextOrPrev, setNextOrPrev] = useState<boolean>(true);
  const nodeRef = useRef<HTMLDivElement>(null);

  // time and param for the visible monthCard month and month +1
  // The dropdown shows currentMonth & currentMonth2
  const currentMonth2 = moment(currentMonth).startOf('month').add(1, 'month').format('YYYY/MM/DD');
  const param: Param = getParam(moment(currentMonth).startOf('month').format('YYYY/MM/DD'));
  const param2: Param = getParam(currentMonth2);

  // handle the data to display the hidden prev monthCard, current visible monthCard & the hidden next monthCard.
  const prevMonthTime = moment(currentMonth)
    .startOf('month')
    .subtract(1, 'month')
    .format('YYYY/MM/DD');
  const nextMonthTime = moment(currentMonth2).startOf('month').add(1, 'month').format('YYYY/MM/DD');

  const paramPrevMonth: Param = getParam(prevMonthTime);
  const paramNextMonth: Param = getParam(nextMonthTime);

  // const isDemo = demo === 'render2month' || demo === 'renderNewMonth' || demo === 'transition';

  // Toggle month theme classNames
  const togglemonth = cx({
    'rangeCard__toggleMonth--dark': theme === 'dark',
    'rangeCard__toggleMonth--light': theme === 'light',
  });

  const togglemonth_classes = classNames(
    styles[togglemonth],
    styles[`rangeCard__toggleMonth`],
    `d-flex`,
    `justify-content-between`,
    `align-items-center`
  );

  const weekDay_classes = classNames(
    styles[
      cx({
        'rangeCard__weekday--light': theme === 'light',
        'rangeCard__weekday--dark': theme === 'dark',
      })
    ],
    'd-flex',
    'justify-content-center'
  );

  // previous Day in month classNames
  const prevAndNext_classes = classNames(
    styles[`rangeCard__day`],
    styles[`rangeCard__day--prevNextMonth`]
  );

  // icon prev classes
  const icon_prev_classes = classNames(
    styles['rangeCard__icon-prevMonth'],
    styles[
      cx({
        'rangeCard__icon-prevMonth--light': theme === 'light',
        'rangeCard__icon-prevMonth--dark': theme === 'dark',
      })
      // cx({
      //   'monthCard__icon-prevMonth--disabled': demo === 'transition',
      // })
    ]
  );

  // icon next classes
  const icon_next_classes = classNames(
    styles['rangeCard__icon-nextMonth'],
    styles[
      cx({
        'rangeCard__icon-nextMonth--light': theme === 'light',
        'rangeCard__icon-nextMonth--dark': theme === 'dark',
      })
    ]
  );

  const transition_container_classes = classNames(
    styles['rangeCard__transition-container'],
    styles[
      cx({
        'rangeCard__transition-container--light': theme === 'light',
        'rangeCard__transition-container--dark': theme === 'dark',
      })
    ]
  );

  const box_classes = classNames(
    styles['rangeCard__container-box'],
    styles[
      cx({
        'rangeCard__container-box--light': theme === 'light',
        'rangeCard__container-box--dark': theme === 'dark',
      })
    ],
    'd-flex',
    'flex-wrap',
    'text'
  );

  const defaultStyle: CSSProperties = {
    transition: `transform ${speed}ms ease-in-out`,
    transform: 'translateX(0)',
    position: 'absolute',
    top: '0',
    left: nextOrPrev && activeTransition ? '0' : !nextOrPrev && activeTransition ? '-219px' : '0',
  };

  const transitionStyles: TransitionStyle = {
    entering: { transform: 'translateX(0)' },
    entered: { transform: 'translateX(0)' },
    exiting: { transform: `translateX(${nextOrPrev ? '-34%' : '34%'})` },
    exited: { transform: 'translateX(0)' },
    unmounted: { transform: 'translateX(0)' },
  };

  const handleSelectedDay = React.useCallback(
    (e: MouseEvent<HTMLElement>, time: string) => {
      setStartTime(startTime);
    },
    [startTime]
  );

  // function to render weekdays in the header
  const weekHeader = React.useMemo(() => {
    const dayList = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return dayList.map((day, i) => (
      <div key={`${day}-${i}`} className={styles['rangeCard__weekday']}>
        {day}
      </div>
    ));
  }, []);

  //   get all the day from the previous Month
  const prevMonth = (param: Param, isHidden?: boolean) => {
    const { prevMonthDays, timeFirstDay } = param;

    return prevMonthDays
      .map((day, i) => {
        const timeDayPrevMonth = moment(timeFirstDay)
          .subtract(day + 1, 'day')
          .format('YYYY/MM/DD');

        const weekdayPrevMonth = moment(timeDayPrevMonth).date();
        return (
          <div
            key={`prev-${i}`}
            className={prevAndNext_classes}
            onClick={() => setStartTime(timeDayPrevMonth)}
          >
            {weekdayPrevMonth}
          </div>
        );
      })
      .reverse();
  };

  // function to render all the day from 1 to 28/29 if Feb. otherwise 30/31
  const dayInMonth = ({ timeFirstDay, numberOfDayInMonth }: Param, isCurrentMonth: boolean) => {
    const monthArr = Array.from({ length: numberOfDayInMonth }, (v, i) => i);
    const selectedDay = moment(startTime).date();

    return monthArr.map((day, i) => {
      const day_time = moment(timeFirstDay).add(day, 'day').format('YYYY/MM/DD');

      const daysInMonth_classes = classNames(
        styles[`rangeCard__day`],
        styles[
          cx({
            'rangeCard__day--selected-light':
              theme === 'light' && isCurrentMonth && selectedDay === day + 1,
            'rangeCard__day--selected-dark':
              theme === 'dark' && isCurrentMonth && selectedDay === day + 1,
          })
        ]
      );
      return (
        <div
          key={`current-${i}`}
          className={daysInMonth_classes}
          onClick={(e) => handleSelectedDay(e, day_time)}
        >
          {day + 1}
        </div>
      );
    });
  };

  // function to render all the days in next month to complete the current row in the current month
  const nextMonth = (param: Param, isHidden?: boolean) => {
    const { nextMonthDays, timeLastDay } = param;
    if (!nextMonthDays) return;

    return nextMonthDays.map((day, i) => {
      const timeDayNextMonth = moment(timeLastDay)
        .add(day + 1, 'day')
        .format('YYYY/MM/DD');
      return (
        <div
          key={`next-${i}`}
          className={prevAndNext_classes}
          onClick={() => setStartTime(timeDayNextMonth)}
        >
          {day + 1}
        </div>
      );
    });
  };

  const handleToggleMonth = (increment: Increment) => {
    // const newTime = moment(currentMonth).startOf('month').format('YYYY/MM/DD');

    const newMonth =
      increment > 0
        ? moment(currentMonth).add(1, 'month').format('YYYY/MM/DD')
        : moment(currentMonth).subtract(1, 'month').format('YYYY/MM/DD');
    setCurrentMonth(newMonth);
    setActiveTransition(false);
  };

  const rangeCard_container_classes = classNames(
    styles['rangeCard__container']
    //   styles[
    //     cx({
    //       'monthCard__container--visible': isDemo,
    //     })
    //   ]
  );

  const handlePreviousOnClick: MouseEventHandler<SVGSVGElement> = (e) => {
    setActiveTransition(true);
    //   if (demo !== 'render2month') {
    setInProp(true);
    //   }
    setNextOrPrev(false);
  };

  return (
    <div ref={ref} className={rangeCard_container_classes}>
      <div>
        <div className={togglemonth_classes}>
          <div className="d-flex gap-5 align-items-center">
            <svg
              className={icon_prev_classes}
              //   onClick={demo === 'transition' ? () => null : handlePreviousOnClick}
              onClick={handlePreviousOnClick}
            >
              <use href={`${sprite}#icon-triangle-left`} className="text"></use>
            </svg>
            <span>{`${param.fullMonth} ${param.year}`}</span>
          </div>
          <div className="d-flex gap-5 align-items-center">
            <span>{`${param2.fullMonth} ${param2.year}`}</span>
            <svg
              className={icon_next_classes}
              onClick={() => {
                setActiveTransition(true);
                // if (demo !== 'render2month') {
                setInProp(true);
                // }

                setNextOrPrev(true);
              }}
            >
              <use href={`${sprite}#icon-triangle-right`}> </use>
            </svg>
          </div>
        </div>
        <div className="d-flex gap-3">
          <div className={weekDay_classes}>{weekHeader}</div>
          <div className={weekDay_classes}>{weekHeader}</div>
        </div>
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
            // if (demo !== 'transition') {
            handleToggleMonth(nextOrPrev ? 1 : -1);
            // }
          }}
        >
          {(state) => {
            const toggledMonthParam = nextOrPrev ? paramNextMonth : paramPrevMonth;

            return (
              <div
                //   key={demoWithNoKey ? 1 : time}
                key={currentMonth}
                className={`d-flex gap-3 flex-row${nextOrPrev ? '' : '-reverse'}`}
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
                ref={nodeRef}
              >
                <div className="d-flex gap-3">
                  <div key={currentMonth} className={box_classes}>
                    {prevMonth(param)}
                    {dayInMonth(param, true)}
                    {nextMonth(param)}
                  </div>
                  <div key={currentMonth2} className={box_classes}>
                    {prevMonth(param2)}
                    {dayInMonth(param2, true)}
                    {nextMonth(param2)}
                  </div>
                </div>
                {activeTransition && (
                  <div className={box_classes}>
                    {prevMonth(toggledMonthParam)}
                    {dayInMonth(toggledMonthParam, false)}
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

export default RangeCard;
