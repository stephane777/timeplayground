// import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import DatePicker from './DatePicker';
import '@testing-library/jest-dom';
import moment from 'moment';
import { getParam } from '../../../src/utils';
import { Param } from '../MonthCard';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

describe('Date Picker', () => {
  test('test date picker render', () => {
    render(<DatePicker speed={300} />);

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('DD/MM/YYYY')).toBeInTheDocument();
  });

  test('Date picker should show today date on intial render:', () => {
    const today = moment().format('DD/MM/YYYY');
    render(<DatePicker speed={300} />);

    expect(screen.queryByDisplayValue(today)).toBeInTheDocument();
  });
});

describe('Focus date picker', () => {
  beforeEach(() => {
    render(<DatePicker speed={300} />);

    fireEvent.focus(screen.getByRole('textbox'));
  });

  test('should show the next & previous buttons:', () => {
    const previousIcon = screen.getByRole('img', { name: 'Previous Month' });
    const nextIcon = screen.getByRole('img', { name: 'Next Month' });

    expect(previousIcon).toBeInTheDocument();
    expect(nextIcon).toBeInTheDocument();
  });

  test('should show the current month & year label', () => {
    const { fullMonth, year }: Param = getParam(new Date().getTime());

    const month_year = `${fullMonth} ${year}`;
    const selectedMonth = screen.getByTestId('monthCard_selected_month', { exact: true });
    expect(selectedMonth).toHaveTextContent(month_year);
  });
});

describe('open/close the dropdown (monthCard)', () => {
  test('a click outside of the inputGroup should close the dropdown', () => {
    render(
      <div>
        <InputGroup>
          <InputGroup.Text id="user_icon">@</InputGroup.Text>
          <Form.Control placeholder="Username" aria-label="username" aria-describedby="user_icon" />
        </InputGroup>
        <DatePicker speed={300} />
      </div>
    );

    const username = screen.getByRole('textbox', { name: 'username' });
    fireEvent.focus(screen.getByRole('textbox', { name: 'date picker' }));

    const selectedMonth = screen.getByTestId('monthCard_selected_month', { exact: true });
    expect(selectedMonth).toBeInTheDocument();

    fireEvent.click(username);
    const selectedMonthNotVisible = screen.queryByTestId('monthCard_selected_month', {
      exact: true,
    });
    expect(selectedMonthNotVisible).toBeNull();
  });

  test("click anywhere in the dropdown shouldn't close it", () => {
    render(<DatePicker speed={300} />);

    fireEvent.focus(screen.getByRole('textbox', { name: 'date picker' }));
    const selectedMonth = screen.getByTestId('monthCard_selected_month');

    fireEvent.click(selectedMonth);
    const selectedMonthVisible = screen.getByTestId('monthCard_selected_month');
    expect(selectedMonthVisible).toBeInTheDocument();
  });
});
