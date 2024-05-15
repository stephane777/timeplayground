import React from 'react';
import {
  render,
  fireEvent,
  screen,
  cleanup,
  getByRole,
  getAllByRole,
  queryAllByRole,
} from '@testing-library/react';
import DateRange from '../DateRange/DateRange';
import { getParam } from '../DateRange/utils';
import { Param } from '../RangeCard/RangeCard';
import moment from 'moment';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  render(<DateRange speed={300} />, {});
  fireEvent.focus(screen.getByRole('textbox'));
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('MonthCard with no Transition', () => {
  it('should trigger the Transition and show next month', async () => {
    const next_month = moment().startOf('month').add(1, 'month').format('YYYY/MM/DD');
    const next_month2 = moment().startOf('month').add(1, 'month').format('YYYY/MM/DD');

    const { fullMonth, year }: Param = getParam(next_month);
    const next_month_year = `${fullMonth} ${year}`;
    const { fullMonth: fullMonth2, year: year2 }: Param = getParam(next_month2);
    const next_month_year2 = `${fullMonth2} ${year2}`;

    const nextIcon = screen.getByRole('img', { name: 'Next Month' });
    expect(nextIcon).toBeInTheDocument();
    await userEvent.click(nextIcon);

    expect(await screen.findByText(next_month_year, { exact: true })).toHaveTextContent(
      next_month_year
    );
    expect(await screen.findByText(next_month_year2, { exact: true })).toHaveTextContent(
      next_month_year2
    );
  });

  it('should trigger the Transition and show previous month', async () => {
    const prev_month = moment().startOf('month').subtract(1, 'month').format('YYYY/MM/DD');
    const prev_month2 = moment().startOf('month').format('YYYY/MM/DD');

    const { fullMonth, year }: Param = getParam(prev_month);
    const prev_month_year = `${fullMonth} ${year}`;
    const { fullMonth: fullMonth2, year: year2 }: Param = getParam(prev_month2);
    const prev_month_year2 = `${fullMonth2} ${year2}`;

    const prevIcon = screen.getByRole('img', { name: 'Previous Month' });
    expect(prevIcon).toBeInTheDocument();
    await userEvent.click(prevIcon);

    expect(await screen.findByText(prev_month_year, { exact: true })).toHaveTextContent(
      prev_month_year
    );
    expect(await screen.findByText(prev_month_year2, { exact: true })).toHaveTextContent(
      prev_month_year2
    );
  });

  it('should update input after user select a day', () => {
    const today = moment().format('DD-MM-YYYY');

    const container = screen.getByTestId('rangeCard_month1');
    const date = getByRole(container, 'button', { name: `current-${moment().date()}` });

    fireEvent.click(date);

    const input2 = screen.getByRole('textbox', { name: 'date range' });

    const [d, m, y] = today.split('-');
    const regex = new RegExp(`${d}-${m}-${y} - [\\w-]+`);

    expect(input2).toHaveDisplayValue(regex);
  });

  it('ARIA: should update input after user select a day', () => {
    const today = moment().format('DD-MM-YYYY');
    const container = screen.getByTestId('rangeCard_month1');
    const date = getByRole(container, 'button', { name: `current-${moment().date()}` });

    fireEvent.keyUp(date, { key: 'Enter', code: 'Enter', charCode: 13 });
    const input2 = screen.getByRole('textbox', { name: 'date range' });

    const [d, m, y] = today.split('-');
    const regex = new RegExp(`${d}-${m}-${y} - [\\w-]+`);

    expect(input2).toHaveDisplayValue(regex);
  });

  it('should show the correct amount of days in both month', () => {
    const days_in_month1 = moment().endOf('month').date();
    const days_in_month2 = moment().add(1, 'month').endOf('month').date();

    const month1_container = screen.getByTestId('rangeCard_month1');
    const month2_container = screen.getByTestId('rangeCard_month2');

    const all_days_in_month1 = getAllByRole(month1_container, 'button', { name: /^current-\d+/ });
    expect(all_days_in_month1).toHaveLength(days_in_month1);

    const all_days_in_month2 = getAllByRole(month2_container, 'button', { name: /^current-\d+/ });
    expect(all_days_in_month2).toHaveLength(days_in_month2);
  });

  it('should show the correct amount of previous month in month1 & month2 ', () => {
    // day of week in moment.js is 1-7 not 0-6
    const prev_month_month1 = moment().startOf('month').day() - 1;
    const prev_month_month2 = moment().add(1, 'month').startOf('month').day() - 1;

    const month1_container = screen.getByTestId('rangeCard_month1');
    const month2_container = screen.getByTestId('rangeCard_month2');

    const all_prev_days_month1 = getAllByRole(month1_container, 'button', {
      name: /^previous-\d+/,
    });
    const all_prev_days_month2 = getAllByRole(month2_container, 'button', {
      name: /^previous-\d+/,
    });

    if (prev_month_month1 > 0 && prev_month_month1 < 7) {
      expect(all_prev_days_month1).toHaveLength(prev_month_month1);
    } else {
      expect(all_prev_days_month1).toStrictEqual([]);
    }
    if (prev_month_month2 > 0 && prev_month_month2 < 7) {
      expect(all_prev_days_month2).toHaveLength(prev_month_month2);
    } else {
      expect(all_prev_days_month2).toStrictEqual([]);
    }
  });

  it('should show the correct amount of next month in month1 & month2 ', () => {
    // day of week in moment.js is 1-7 not 0-6
    const next_month_month1 = 7 - moment().endOf('month').day();
    const next_month_month2 = 7 - moment().add(1, 'month').endOf('month').day();

    const month1_container = screen.getByTestId('rangeCard_month1');
    const month2_container = screen.getByTestId('rangeCard_month2');

    const all_next_days_month1 = queryAllByRole(month1_container, 'button', {
      name: /^next-\d+/,
    });
    const all_next_days_month2 = queryAllByRole(month2_container, 'button', {
      name: /^next-\d+/,
    });

    if (next_month_month1 > 0 && next_month_month1 < 7) {
      expect(all_next_days_month1).toHaveLength(next_month_month1);
    } else {
      expect(all_next_days_month1).toStrictEqual([]);
    }
    if (next_month_month2 > 0 && next_month_month2 < 7) {
      expect(all_next_days_month2).toHaveLength(next_month_month2);
    } else {
      expect(all_next_days_month2).toStrictEqual([]);
    }
  });

  it('should select a day from previous month', async () => {
    const month1_container = screen.getByTestId('rangeCard_month1');

    const previous_days = getAllByRole(month1_container, 'button', { name: /^previous-\d+/ });
    const target = moment().subtract(1, 'month').endOf('month').format('DD-MM-YYYY');

    await userEvent.click(previous_days[previous_days.length - 1]);

    const input = screen.getByRole('textbox', { name: 'date range' });

    const [d, m, y] = target.split('-');
    const regex = new RegExp(`${d}-${m}-${y} - [\\w-]+`);

    expect(input).toHaveDisplayValue(regex);
  });

  it('ARIA: should select a day from previous month', () => {
    const month1_container = screen.getByTestId('rangeCard_month1');

    const previous_days = getAllByRole(month1_container, 'button', { name: /^previous-\d+/ });
    const target = moment().subtract(1, 'month').endOf('month').format('DD-MM-YYYY');

    // await userEvent.click(previous_days[previous_days.length - 1]);
    fireEvent.keyUp(previous_days[previous_days.length - 1], {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });
    const input = screen.getByRole('textbox', { name: 'date range' });

    const [d, m, y] = target.split('-');
    const regex = new RegExp(`${d}-${m}-${y} - [\\w-]+`);

    expect(input).toHaveDisplayValue(regex);
  });

  it('sould select a start and end date', () => {
    const month1_container = screen.getByTestId('rangeCard_month1');

    const fifth_day = moment().set('date', 5).format('DD-MM-YYYY');
    const sixteenth_day = moment().set('date', 16).format('DD-MM-YYYY');

    const fifth_day_button = getByRole(month1_container, 'button', { name: 'current-5' });
    const sixteenth_day_button = getByRole(month1_container, 'button', { name: 'current-16' });

    // Select start date
    fireEvent.click(fifth_day_button);
    const input = screen.getByRole('textbox', { name: 'date range' });

    const [d, m, y] = fifth_day.split('-');
    const regex = new RegExp(`${d}-${m}-${y} - [\\w-]+`);

    expect(input).toHaveDisplayValue(regex);

    // Select end date
    fireEvent.click(sixteenth_day_button);
    const input2 = screen.getByRole('textbox', { name: 'date range' });

    const [d2, m2, y2] = sixteenth_day.split('-');
    const regex2 = new RegExp(`${d}-${m}-${y} - ${d2}-${m2}-${y2}`);

    expect(input2).toHaveDisplayValue(regex2);
  });

  it('should select the last date clicked if the new date selected is older that the previous selected', () => {
    const month1_container = screen.getByTestId('rangeCard_month1');

    const fifth_day = moment().set('date', 5).format('DD-MM-YYYY');
    const second_day = moment().set('date', 2).format('DD-MM-YYYY');

    const fifth_day_button = getByRole(month1_container, 'button', { name: 'current-5' });
    const second_day_button = getByRole(month1_container, 'button', { name: 'current-2' });

    // Select start date
    fireEvent.click(fifth_day_button);
    const input = screen.getByRole('textbox', { name: 'date range' });

    const [d, m, y] = fifth_day.split('-');
    const regex = new RegExp(`${d}-${m}-${y} - [\\w-]+`);

    expect(input).toHaveDisplayValue(regex);

    // Select end date
    fireEvent.click(second_day_button);
    const input2 = screen.getByRole('textbox', { name: 'date range' });

    const [d2, m2, y2] = second_day.split('-');
    const regex2 = new RegExp(`${d2}-${m2}-${y2} - [\\w-]+`);

    expect(input2).toHaveDisplayValue(regex2);
  });

  it('should reset end date if a new start date is clicked after both already been selected', () => {
    const month1_container = screen.getByTestId('rangeCard_month1');

    const fifth_day = moment().set('date', 5).format('DD-MM-YYYY');
    const sixteenth_day = moment().set('date', 16).format('DD-MM-YYYY');
    const seventh_day = moment().set('date', 7).format('DD-MM-YYYY');

    const fifth_day_button = getByRole(month1_container, 'button', { name: 'current-5' });
    const sixteenth_day_button = getByRole(month1_container, 'button', { name: 'current-16' });
    const seventh_day_button = getByRole(month1_container, 'button', { name: 'current-7' });

    // Select start date
    fireEvent.click(fifth_day_button);
    const input = screen.getByRole('textbox', { name: 'date range' });

    const [d, m, y] = fifth_day.split('-');
    const regex = new RegExp(`${d}-${m}-${y} - [\\w-]+`);

    expect(input).toHaveDisplayValue(regex);

    // Select end date
    fireEvent.click(sixteenth_day_button);
    const input2 = screen.getByRole('textbox', { name: 'date range' });

    const [d2, m2, y2] = sixteenth_day.split('-');
    const regex2 = new RegExp(`${d}-${m}-${y} - ${d2}-${m2}-${y2}`);

    expect(input2).toHaveDisplayValue(regex2);

    // Select a new date should should replace old start date and clear end date
    fireEvent.click(seventh_day_button);
    const input3 = screen.getByRole('textbox', { name: 'date range' });

    const [d3, m3, y3] = seventh_day.split('-');
    const regex3 = new RegExp(`${d3}-${m3}-${y3} - [\\w-]+`);

    expect(input3).toHaveDisplayValue(regex3);
  });

  it("shouldn't change anything if the same start date is clicked: ", () => {
    const month1_container = screen.getByTestId('rangeCard_month1');

    const fourteenth_day = moment().set('date', 14).format('DD-MM-YYYY');
    const fourteenth_day_button = getByRole(month1_container, 'button', { name: 'current-14' });

    // Select start date
    fireEvent.click(fourteenth_day_button);
    const input = screen.getByRole('textbox', { name: 'date range' });

    const [d, m, y] = fourteenth_day.split('-');
    const regex = new RegExp(`${d}-${m}-${y} - [\\w-]+`);

    expect(input).toHaveDisplayValue(regex);

    // Select start date again
    fireEvent.click(fourteenth_day_button);
    const input2 = screen.getByRole('textbox', { name: 'date range' });
    expect(input2).toHaveDisplayValue(regex);
  });
});
