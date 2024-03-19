import React, {
  useRef,
  useState,
  useEffect,
  MouseEventHandler,
  ReactNode,
  MouseEvent,
} from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import sprite from '../../assets/img/svg/sprite.svg';
import styles from './DatePicker.module.scss';
import classNames from 'classnames/bind';
import { useTheme } from '../../context/themeContext';
import MonthCard from '../MonthCard/MonthCard';
import { utcTime_to_date, maxDayInMonth, isCurrentYearBisextile } from '../../utils';
const cx = classNames.bind(styles);

const DatePicker: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [active, setActive] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const controlInputRef = useRef<HTMLInputElement | null>(null);
  const monthCardRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  // Effect to update the date input with the current day.
  useEffect(() => {
    if (time) {
      const { year, month, day } = utcTime_to_date(new Date(time).getTime());
      if (controlInputRef.current) {
        controlInputRef.current.value = `${day}/${month}/${year}`;
      }
    }
    if (!time) setTime(new Date().getTime());
  }, [time]);

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
    'datePicker__input--dark': theme === 'dark',
  });

  const inputGroupTheme = cx({
    'datePicker__inputgroup--dark': theme === 'dark',
  });

  const calendar_icon_classes = cx({
    'datePicker__calendar-icon': true,
    'datePicker__calendar-icon--light': theme === 'light',
    'datePicker__calendar-icon--dark': theme === 'dark',
  });
  return (
    <div className={styles[`datePicker`]}>
      <InputGroup className="mb-3 mt-5">
        <Form.Label htmlFor="date" className="align-self-center me-4">
          Date
        </Form.Label>
        <Form.Control
          type="text"
          id="date"
          aria-describedby="cal_icon"
          aria-label="date"
          placeholder="DD/MM/YYYY"
          ref={controlInputRef}
          className={inputTheme}
          onFocus={(e) => setActive(true)}
        />
        <InputGroup.Text id="cal_icon" className={inputGroupTheme}>
          {/* <svg className="footer__icon-github"> */}

          <svg className={calendar_icon_classes}>
            <use href={`${sprite}#icon-calendar`}></use>
          </svg>
        </InputGroup.Text>
        {active && (
          <MonthCard
            ref={monthCardRef}
            time={time}
            setTime={setTime}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        )}
      </InputGroup>
    </div>
  );
};

export default DatePicker;
