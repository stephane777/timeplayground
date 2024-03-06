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
const cx = classNames.bind(styles);

interface DatePickerProps {
  onFocusChange: (focused: boolean) => void;
  focused: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ onFocusChange, focused }) => {
  const [time, setTime] = useState('');
  const [active, setActive] = useState<boolean>(false);

  const controlInputRef = useRef<HTMLInputElement | null>(null);
  const monthCardRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

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

          <svg className={styles[`datePicker__calendar-icon`]}>
            <use href={`${sprite}#icon-calendar`}></use>
          </svg>
        </InputGroup.Text>
        {active && <MonthCard ref={monthCardRef} />}
      </InputGroup>
      {/* <Form.Text id="datePickerHelp">Form text </Form.Text> */}

      {/* // {error && <span className="datePicker__error">{error}</span>} */}

      {/* {!error && focused && <Grid handlePickerFocus={handlePickerFocus} ref={gridRef} setTime={setTime} time={time} />} */}
    </div>
  );
};

export default DatePicker;