import React, { useRef, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import sprite from '../../assets/img/svg/sprite.svg';
import styles from './DateRange.module.scss';
import classNames from 'classnames/bind';
import { useTheme } from '../../context/themeContext';

import moment from 'moment';
import RangeCard from '../RangeCard/RangeCard';
const cx = classNames.bind(styles);

interface DateRange {
  speed: number;
  demo?: 'render2month' | 'transition' | 'renderNewMonth';
  demoWithNoKey?: boolean;
}

const DateRange: React.FC<DateRange> = ({ speed, demo, demoWithNoKey }) => {
  const [currentMonth, setCurrentMonth] = useState<string>(moment().format('YYYY/MM/DD'));
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [active, setActive] = useState<boolean>(false);

  const controlInputRef = useRef<HTMLInputElement>(null);
  const monthCardRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Effect to update the date input with the current day.
  useEffect(() => {
    if (controlInputRef.current) {
      const start = startTime ? moment(startTime).format('DD/MM/YYYY') : 'DD/MM/YYYY';
      const end = endTime ? moment(endTime).format('DD/MM/YYYY') : 'DD/MM/YYYY';

      controlInputRef.current.value = `${start} - ${end}`;
    }
  }, [startTime, endTime]);

  // Effect to track mouse activity around the DateRange
  useEffect(() => {
    const handleClickOutside: EventListener = (event: Event) => {
      const isOnInput = controlInputRef?.current?.contains(event.target as Node);
      const isOnMonthCard = monthCardRef?.current?.contains(event.target as Node);

      if (isOnInput || isOnMonthCard) {
        return;
      }
      setActive(false);
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const inputTheme = cx({
    'dateRange__input--dark': theme === 'dark',
  });

  const inputGroupTheme = cx({
    'dateRange__inputgroup--dark': theme === 'dark',
  });

  const calendar_icon_classes = cx({
    'dateRange__calendar-icon': true,
    [`dateRange__calendar-icon--${theme}`]: true,
  });

  return (
    <div className={styles[`dateRange`]}>
      <InputGroup>
        <Form.Label htmlFor="date" className="align-self-center me-4">
          Date
        </Form.Label>
        <Form.Control
          type="text"
          id="date"
          aria-describedby="cal_icon"
          aria-label="date"
          placeholder="DD/MM/YYYY - DD/MM/YYYY"
          ref={controlInputRef}
          className={inputTheme}
          onFocus={(e) => setActive(true)}
        />
        <InputGroup.Text id="cal_icon" className={inputGroupTheme}>
          <svg className={calendar_icon_classes}>
            <use href={`${sprite}#icon-calendar`}></use>
          </svg>
        </InputGroup.Text>
        {active && (
          <RangeCard
            ref={monthCardRef}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            speed={speed}
            // demo={demo}
            // demoWithNoKey={demoWithNoKey}
          />
        )}
      </InputGroup>
    </div>
  );
};

export default DateRange;
