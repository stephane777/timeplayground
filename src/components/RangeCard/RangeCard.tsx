import React, {
  forwardRef,
  useRef,
  useState,
  Dispatch,
  MouseEvent,
  KeyboardEvent,
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

export type Param = ReturnType<typeof getParam>;

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
    setActive,
    disablePastDay,
    highlightToday,
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

  const currentMonth2 = moment(new Date(currentMonth))
    .startOf('month')
    .add(1, 'month')
    .format('YYYY/MM/DD');
  const param: Param = getParam(
    moment(new Date(currentMonth)).startOf('month').format('YYYY-MM-DD')
  );
  const param2: Param = getParam(currentMonth2);

  // handle the data to display the hidden prev monthCard, current visible monthCard & the hidden next monthCard.
  const prevMonthTime = moment(new Date(currentMonth))
    .startOf('month')
    .subtract(1, 'month')
    .format('YYYY-MM-DD');
  const nextMonthTime = moment(new Date(currentMonth2))
    .startOf('month')
    .add(1, 'month')
    .format('YYYY-MM-DD');

  const paramPrevMonth: Param = getParam(prevMonthTime);
  const paramNextMonth: Param = getParam(nextMonthTime);

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

  const handleSelectedDay = (
    e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>,
    selectedTime: string
  ) => {
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
  const prevMonth = (param: Param) => {
    const { prevMonthDays, timeFirstDay, today } = param;

    return prevMonthDays
      .map((day, i) => {
        const timeDayPrevMonth = moment(timeFirstDay)
          .subtract(day + 1, 'day')
          .format('YYYY-MM-DD');

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
            aria-label={`previous-${day + 1}`}
            role="button"
            className={prevMonth_classes}
            onClick={isDayPast ? () => null : (e) => handleSelectedDay(e, timeDayPrevMonth)}
            onKeyUp={isDayPast ? () => null : (e) => handleSelectedDay(e, timeDayPrevMonth)}
            tabIndex={0}
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
      const day_time = moment(new Date(timeFirstDay)).add(day, 'day').format('YYYY-MM-DD');
      const isStartTime = moment(new Date(day_time)).isSame(startTime, 'day');
      const isEndTime = moment(new Date(day_time)).isSame(endTime, 'day');
      const isBetween =
        moment(new Date(day_time)).isAfter(startTime, 'day') &&
        moment(new Date(day_time)).isBefore(endTime, 'day');

      const isTodayAndNotSelected =
        highlightToday &&
        !isStartTime &&
        !isEndTime &&
        !isBetween &&
        moment(new Date(day_time)).isSame(today, 'day');

      const isDayPast = disablePastDay && moment(new Date(today)).isAfter(day_time, 'day');
      const isWeekend =
        !isDayPast &&
        !isStartTime &&
        !isEndTime &&
        !isBetween &&
        [0, 6].includes(moment(new Date(day_time)).day());

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
            'rangeCard__day--weekend': isWeekend,
          })
        ]
      );
      return (
        <div
          role="button"
          aria-label={`current-${day + 1}`}
          key={`current-${i}`}
          className={daysInMonth_classes}
          onClick={isDayPast ? () => null : (e) => handleSelectedDay(e, day_time)}
          onKeyUp={isDayPast ? () => null : (e) => handleSelectedDay(e, day_time)}
          tabIndex={0}
        >
          {day + 1}
        </div>
      );
    });
  };

  // function to render all the days in next month to complete the current row in the current month
  const nextMonth = (param: Param) => {
    const { nextMonthDays, timeLastDay, today } = param;

    return nextMonthDays?.map((day, i) => {
      const timeDayNextMonth = moment(new Date(timeLastDay))
        .add(day + 1, 'day')
        .format('YYYY-MM-DD');
      const isDayPast = disablePastDay && moment(new Date(today)).isAfter(timeDayNextMonth, 'day');

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
          aria-label={`next-${day + 1}`}
          role="button"
          className={nextMonth_classes}
          onClick={isDayPast ? () => null : (e) => handleSelectedDay(e, timeDayNextMonth)}
          onKeyUp={isDayPast ? () => null : (e) => handleSelectedDay(e, timeDayNextMonth)}
          tabIndex={0}
        >
          {day + 1}
        </div>
      );
    });
  };

  const handleToggleMonth = (increment: Increment) => {
    const newMonth =
      increment > 0
        ? moment(new Date(currentMonth)).add(1, 'month').format('YYYY-MM-DD')
        : moment(new Date(currentMonth)).subtract(1, 'month').format('YYYY-MM-DD');
    setCurrentMonth(newMonth);
    setActiveTransition(false);
  };

  const handleArrowClick = (e: MouseEvent<SVGSVGElement>, isNextOrPrevious: boolean) => {
    e.preventDefault();
    setActiveTransition(true);
    setInProp(true);
    setNextOrPrev(isNextOrPrevious);
  };

  return (
    <div ref={ref} className={rangeCard_container_classes}>
      <div className="d-flex gap-3">
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center justify-content-center">
            <svg
              role="img"
              aria-labelledby="svgPrevious"
              className={icon_prev_classes}
              focusable={true}
              onClick={(e) => handleArrowClick(e, false)}
            >
              <title id="svgPrevious">Previous Month</title>
              <use href={`${sprite}#icon-triangle-left`} className="text"></use>
            </svg>
            <span
              data-testid="rangeCard_selected_month"
              className="flex-grow-1 d-flex justify-content-center"
            >{`${param.fullMonth} ${param.year}`}</span>
          </div>
          <div className="d-flex justify-content-center">{weekHeader}</div>
        </div>
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center justify-content-center ">
            <span
              data-testid="rangeCard_selected_month2"
              className="flex-grow-1 d-flex justify-content-center"
            >{`${param2.fullMonth} ${param2.year}`}</span>
            <svg
              role="img"
              aria-labelledby="svgNext"
              focusable={true}
              className={icon_next_classes}
              onClick={(e) => handleArrowClick(e, true)}
            >
              <title id="svgNext">Next Month</title>
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
            handleToggleMonth(nextOrPrev ? 1 : -1);
          }}
        >
          {(state) => {
            const toggledMonthParam = nextOrPrev ? paramNextMonth : paramPrevMonth;

            return (
              <div
                id="rangeCard_transition_ref"
                key={currentMonth}
                className={`d-flex gap-3 flex-row${nextOrPrev ? '' : '-reverse'}`}
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
                ref={nodeRef}
              >
                <div className="d-flex gap-3">
                  <div data-testid="rangeCard_month1" key={currentMonth} className={box_classes}>
                    {prevMonth(param)}
                    {dayInMonth(param)}
                    {nextMonth(param)}
                  </div>
                  <div data-testid="rangeCard_month2" key={currentMonth2} className={box_classes}>
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
