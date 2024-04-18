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
import Button from 'react-bootstrap/Button';
import { Transition, TransitionStatus } from 'react-transition-group';
import styles from './RangeCard.module.scss';
import sprite from '../../assets/img/svg/sprite.svg';
import classNames from 'classnames';
import { useTheme } from '../../context/themeContext';
import { getParam } from '../DateRange/utils';
import moment from 'moment';
import { Badge } from 'react-bootstrap';
const cx = classNames.bind(styles);

interface RangeCardProps {
  currentMonth: string;
  setCurrentMonth: Dispatch<SetStateAction<string>>;
  startTime: string | null;
  setStartTime: Dispatch<SetStateAction<string | null>>;
  endTime: string | null;
  setEndTime: Dispatch<SetStateAction<string | null>>;
  speed: number;
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  disablePastDay?: boolean;
  highlightToday?: boolean;
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
    active,
    setActive,
    disablePastDay,
    highlightToday,
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

  // Duration computed once startTime & endTime are selected
  const duration =
    startTime && endTime && moment.duration(moment(endTime).diff(startTime)).asDays();
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
        [`rangeCard__icon-prevMonth--${theme}`]: true,
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
        [`rangeCard__icon-nextMonth--${theme}`]: true,
      })
    ]
  );

  const box_classes = classNames(styles['rangeCard__container-box'], 'd-flex', 'flex-wrap', 'text');

  const rangeCard_container_classes = classNames(
    styles['rangeCard__container'],
    styles[cx({ [`rangeCard__container--${theme}`]: true })]
    //   styles[
    //     cx({
    //       'monthCard__container--visible': isDemo,
    //     })
    //   ]
  );

  const defaultStyle: CSSProperties = {
    transition: `transform ${speed}ms ease-in-out`,
    transform: 'translateX(0)',
    position: 'absolute',
    top: '0',
    left: nextOrPrev && activeTransition ? '0' : !nextOrPrev && activeTransition ? '-200px' : '0',
  };

  const transitionStyles: TransitionStyle = {
    entering: { transform: 'translateX(0)' },
    entered: { transform: 'translateX(0)' },
    exiting: { transform: `translateX(${nextOrPrev ? '-34%' : '34%'})` },
    exited: { transform: 'translateX(0)' },
    unmounted: { transform: 'translateX(0)' },
  };

  const handleSelectedDay = (e: MouseEvent<HTMLDivElement>, selectedTime: string) => {
    const isNewTimeBeforeStartTime = startTime && moment(selectedTime).isBefore(startTime, 'day');
    const isNewTimeSameAsStartTime = startTime && moment(selectedTime).isSame(startTime, 'day');
    if (!startTime && !endTime) {
      setStartTime(selectedTime);
      return;
    }
    if (startTime && !endTime && isNewTimeSameAsStartTime) {
      return;
    }
    if (startTime && !endTime && isNewTimeBeforeStartTime) {
      setStartTime(selectedTime);
      return;
    }
    if (startTime && !endTime && !isNewTimeBeforeStartTime) {
      setEndTime(selectedTime);
      return;
    }
    if (startTime && endTime) {
      setStartTime(selectedTime);
      setEndTime(null);
    }
  };

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
    const { prevMonthDays, timeFirstDay, today } = param;

    return prevMonthDays
      .map((day, i) => {
        const timeDayPrevMonth = moment(timeFirstDay)
          .subtract(day + 1, 'day')
          .format('YYYY/MM/DD');

        const weekdayPrevMonth = moment(timeDayPrevMonth).date();
        const isDayPast = disablePastDay && moment(today).isAfter(timeDayPrevMonth, 'day');

        const prevMonth_classes = classNames(
          prevAndNext_classes,
          styles[
            cx({
              [`rangeCard__day--disabled-${theme}`]: isDayPast,
            })
          ]
        );

        return (
          <div
            key={`prev-${i}`}
            className={prevMonth_classes}
            onClick={isDayPast ? () => null : (e) => handleSelectedDay(e, timeDayPrevMonth)}
          >
            {weekdayPrevMonth}
          </div>
        );
      })
      .reverse();
  };

  // function to render all the day from 1 to 28/29 if Feb. otherwise 30/31
  const dayInMonth = ({ timeFirstDay, numberOfDayInMonth, today }: Param) => {
    const monthArr = Array.from({ length: numberOfDayInMonth }, (v, i) => i);

    return monthArr.map((day, i) => {
      const day_time = moment(timeFirstDay).add(day, 'day').format('YYYY/MM/DD');
      const isStartTime = moment(day_time).isSame(startTime, 'day');
      const isEndTime = moment(day_time).isSame(endTime, 'day');
      const isBetween =
        moment(day_time).isAfter(startTime, 'day') && moment(day_time).isBefore(endTime, 'day');

      const isTodayAndNotSelected =
        highlightToday &&
        !isStartTime &&
        !isEndTime &&
        !isBetween &&
        moment(day_time).isSame(today, 'day');

      const isDayPast = disablePastDay && moment(today).isAfter(day_time, 'day');

      const daysInMonth_classes = classNames(
        styles[`rangeCard__day`],
        styles[cx({ [`rangeCard__day--selected-${theme}`]: isStartTime || isEndTime })],
        styles[
          cx({
            'rangeCard__day--endTime': isEndTime,
            'rangeCard__day--startTime': isStartTime,
            [`rangeCard__day--between-${theme}`]: isBetween,
            'rangeCard__day--today': isTodayAndNotSelected,
            [`rangeCard__day--disabled-${theme}`]: isDayPast,
          })
        ]
      );
      return (
        <div
          key={`current-${i}`}
          className={daysInMonth_classes}
          onClick={isDayPast ? () => null : (e) => handleSelectedDay(e, day_time)}
        >
          {day + 1}
        </div>
      );
    });
  };

  // function to render all the days in next month to complete the current row in the current month
  const nextMonth = (param: Param, isHidden?: boolean) => {
    const { nextMonthDays, timeLastDay, today } = param;
    if (!nextMonthDays) return;

    return nextMonthDays.map((day, i) => {
      const timeDayNextMonth = moment(timeLastDay)
        .add(day + 1, 'day')
        .format('YYYY/MM/DD');
      const isDayPast = disablePastDay && moment(today).isAfter(timeDayNextMonth, 'day');

      const nextMonth_classes = classNames(
        prevAndNext_classes,
        styles[
          cx({
            [`rangeCard__day--disabled-${theme}`]: isDayPast,
          })
        ]
      );

      return (
        <div
          key={`next-${i}`}
          className={nextMonth_classes}
          onClick={isDayPast ? () => null : (e) => handleSelectedDay(e, timeDayNextMonth)}
        >
          {day + 1}
        </div>
      );
    });
  };

  const handleToggleMonth = (increment: Increment) => {
    const newMonth =
      increment > 0
        ? moment(currentMonth).add(1, 'month').format('YYYY/MM/DD')
        : moment(currentMonth).subtract(1, 'month').format('YYYY/MM/DD');
    setCurrentMonth(newMonth);
    setActiveTransition(false);
  };

  const handleArrowClick = (e: MouseEvent<SVGSVGElement>, isNextOrPrevious: boolean) => {
    e.preventDefault();
    setActiveTransition(true);
    //   if (demo !== 'render2month') {
    setInProp(true);
    //   }
    setNextOrPrev(isNextOrPrevious);
  };

  return (
    <div ref={ref} className={rangeCard_container_classes}>
      <div className="d-flex gap-3">
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center justify-content-center">
            <svg
              className={icon_prev_classes}
              //   onClick={demo === 'transition' ? () => null : handlePreviousOnClick}
              onClick={(e) => handleArrowClick(e, false)}
            >
              <use href={`${sprite}#icon-triangle-left`} className="text"></use>
            </svg>
            <span className="flex-grow-1 d-flex justify-content-center">{`${param.fullMonth} ${param.year}`}</span>
          </div>
          <div className="d-flex justify-content-center">{weekHeader}</div>
        </div>
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center justify-content-center ">
            <span className="flex-grow-1 d-flex justify-content-center">{`${param2.fullMonth} ${param2.year}`}</span>
            <svg className={icon_next_classes} onClick={(e) => handleArrowClick(e, true)}>
              <use href={`${sprite}#icon-triangle-right`}> </use>
            </svg>
          </div>
          <div className="d-flex justify-content-center">{weekHeader}</div>
        </div>
      </div>

      <div className={styles['rangeCard__transition-container']}>
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
                    {dayInMonth(param)}
                    {nextMonth(param)}
                  </div>
                  <div key={currentMonth2} className={box_classes}>
                    {prevMonth(param2)}
                    {dayInMonth(param2)}
                    {nextMonth(param2)}
                  </div>
                </div>
                {activeTransition && (
                  <div className={box_classes}>
                    {prevMonth(toggledMonthParam)}
                    {dayInMonth(toggledMonthParam)}
                    {nextMonth(toggledMonthParam)}
                  </div>
                )}
              </div>
            );
          }}
        </Transition>
      </div>
      <div className="m-0 d-flex justify-content-between">
        <div>{duration && <Badge pill bg="secondary">{`Duration :${duration}`}</Badge>}</div>
        <div className="d-flex gap-2">
          {startTime && endTime && (
            <Button
              onClick={() => setActive(false)}
              size="sm"
              className="m-0 p-0 link-primary text-decoration-none"
              variant="link"
            >
              {'Done'}
            </Button>
          )}
          <Button
            onClick={() => setStartTime(param.today)}
            size="sm"
            className="m-0 p-0 link-primary text-decoration-none"
            variant="link"
          >
            {'Today'}
          </Button>
          <Button
            onClick={() => {
              setStartTime(null);
              setEndTime(null);
            }}
            size="sm"
            className="m-0 p-0 link-primary text-decoration-none"
            variant="link"
          >
            {'Clear'}
          </Button>
        </div>
      </div>
    </div>
  );
});

export default RangeCard;
