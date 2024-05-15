import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DateRange from './DateRange';
import moment from 'moment';
import { getParam } from './utils';
import { Param } from '../RangeCard';
import { Form, InputGroup } from 'react-bootstrap';

describe('Date Range', () => {
  test('Date Range test render', () => {
    const { getByRole, getByText, getByPlaceholderText } = render(<DateRange speed={300} />);

    const input = getByRole('textbox', { name: 'date range' });
    expect(input).toBeInTheDocument();
    expect(getByText('Date')).toBeInTheDocument();
    expect(getByPlaceholderText('DD-MM-YYYY - DD-MM-YYYY')).toBeInTheDocument();
  });
});

describe('Focus Date range', () => {
  beforeEach(() => {
    render(<DateRange speed={300} />);

    fireEvent.focus(screen.getByRole('textbox'));
  });
  test('should show the next & previous buttons', () => {
    const previousIcon = screen.getByRole('img', { name: 'Previous Month' });
    const nextIcon = screen.getByRole('img', { name: 'Next Month' });

    expect(previousIcon).toBeInTheDocument();
    expect(nextIcon).toBeInTheDocument();
  });
  test('should show 2 month & year label', () => {
    const { fullMonth, year }: Param = getParam(moment().format('YYYY-MM-DD'));
    const next_month = moment().startOf('month').add(1, 'month').format('YYYY-MM-DD');
    const { fullMonth: nextFullMonth, year: nextYear }: Param = getParam(next_month);

    const month_year = `${fullMonth} ${year}`;
    const next_month_year = `${nextFullMonth} ${nextYear}`;

    const selectedMonth = screen.getByTestId('rangeCard_selected_month', { exact: true });
    const selectedMonth2 = screen.getByTestId('rangeCard_selected_month2', { exact: true });

    expect(selectedMonth).toHaveTextContent(month_year);
    expect(selectedMonth2).toHaveTextContent(next_month_year);
  });
});

describe('open/close the dropdown (monthCard)', () => {
  test('a click outside of the inputGroup should close the dropdown', () => {
    const { getByRole, getByTestId, queryByTestId } = render(
      <div>
        <InputGroup>
          <InputGroup.Text id="user_icon">@</InputGroup.Text>
          <Form.Control placeholder="Username" aria-label="username" aria-describedby="user_icon" />
        </InputGroup>
        <DateRange speed={300} />
      </div>
    );

    const username = getByRole('textbox', { name: 'username' });
    fireEvent.focus(getByRole('textbox', { name: 'date range' }));

    const selectedMonth = getByTestId('rangeCard_selected_month', { exact: true });
    expect(selectedMonth).toBeInTheDocument();

    fireEvent.click(username);
    const selectedMonthNotVisible = queryByTestId('rangeCard_selected_month', { exact: true });
    expect(selectedMonthNotVisible).toBeNull();
  });

  test("click anywhere in the dropdown shouldn't close it", () => {
    const { getByRole, getByTestId } = render(<DateRange speed={300} />);

    fireEvent.focus(getByRole('textbox', { name: 'date range' }));
    const selectedMonth = screen.getByTestId('rangeCard_selected_month');

    fireEvent.click(selectedMonth);
    const selectedMonthVisible = getByTestId('rangeCard_selected_month');
    expect(selectedMonthVisible).toBeInTheDocument();
  });
});
