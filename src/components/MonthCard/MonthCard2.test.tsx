import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import DatePicker from '../DatePicker/DatePicker';
import { getParam } from '../../../src/utils';
import { Param } from '../MonthCard';
import moment from 'moment';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  render(<DatePicker speed={300} />);
  fireEvent.focus(screen.getByRole('textbox'));
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('MonthCard with no Transition', () => {
  it('should trigger the Transition and show next month', async () => {
    const date = new Date();

    const next_Month = date.setMonth(date.getMonth() + 1);
    const { fullMonth, year }: Param = getParam(new Date(next_Month).getTime());
    const next_month_year = `${fullMonth} ${year}`;

    const nextIcon = screen.getByRole('img', { name: 'Next Month' });

    await userEvent.click(nextIcon);

    expect(await screen.findByText(next_month_year, { exact: true })).toHaveTextContent(
      next_month_year
    );
  });

  it('should trigger the Transition and show previous month', async () => {
    const date = new Date();

    const prev_Month = date.setMonth(date.getMonth() - 1);
    const { fullMonth, year }: Param = getParam(new Date(prev_Month).getTime());
    const prev_month_year = `${fullMonth} ${year}`;

    const prevIcon = screen.getByRole('img', { name: 'Previous Month' });

    await userEvent.click(prevIcon);

    expect(await screen.findByText(prev_month_year, { exact: true })).toHaveTextContent(
      prev_month_year
    );
  });

  it('should update input after user select (clicked) a day', () => {
    const fifth_day = screen.getByRole('button', { name: 'current-5' });

    const date = moment().set('date', 5).format('DD/MM/YYYY');
    fireEvent.click(fifth_day);

    const input = screen.getByRole('textbox', { name: 'date picker' });
    expect(input).toHaveDisplayValue(date);
  });

  it('should show the correct amount of day for the current month', () => {
    const days_in_month = moment().endOf('month').date();

    const all_days = screen.getAllByRole('button', { name: /^current-\d+/ });
    expect(all_days).toHaveLength(days_in_month);
  });

  it('should show the correct amount of day from the previous month to complete a week', () => {
    // day of week in moment.js is 1-7 not 0-6
    const prev_month_days = moment().startOf('month').day() - 1;

    const all_prev_days = screen.getAllByRole('button', { name: /^previous-\d+/ });
    expect(all_prev_days).toHaveLength(prev_month_days);
  });

  it('should show the correct amount of day from the next month to complete a week ', () => {
    // day of week in moment.js is 1-7 not 0-6
    const next_month_days = 7 - moment().endOf('month').day();

    const all_next_days = screen.getAllByRole('button', { name: /^next-\d+/ });
    expect(all_next_days).toHaveLength(next_month_days);
  });

  it('should select a day from previous month', async () => {
    const previous_days = screen.getAllByRole('button', { name: /^previous-\d+/ });

    const target = moment().subtract(1, 'month').endOf('month').format('DD/MM/YYYY');

    await userEvent.click(previous_days[previous_days.length - 1]);
    const input = screen.getByRole('textbox', { name: 'date picker' });

    expect(input).toHaveDisplayValue(target);
  });

  it('should select a day from next month', async () => {
    const next_days = screen.getAllByRole('button', { name: /^next-\d+/ });

    const target = moment().add(1, 'month').startOf('month').format('DD/MM/YYYY');

    await userEvent.click(next_days[0]);
    const input = screen.getByRole('textbox', { name: 'date picker' });

    expect(input).toHaveDisplayValue(target);
  });

  it('test cleanup', () => {
    const input = screen.getByRole('textbox', { name: 'date picker' });
    const today = moment().format('DD/MM/YYYY');

    expect(input).toHaveDisplayValue(today);
  });
});
