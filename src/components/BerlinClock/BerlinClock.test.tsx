// import { describe, expect, test, jest } from '@jest/globals';
import React from 'react';
import { cleanup, getAllByRole, render } from '@testing-library/react';
// import { logRoles } from '@testing-library/dom';
import { BerlinClock } from './BerlinClock';
import moment from 'moment';
import { convertTime } from './BerlinClock';
import { BerlinClockState } from './BerlinClock';
import userEvent from '@testing-library/user-event';

type Hours = Pick<BerlinClockState, 'fiveHoursCell'>;
type Hour = Pick<BerlinClockState, 'fiveHoursCell' | 'hours'>;
type Minutes = Pick<BerlinClockState, 'fiveMinutesCell'>;
type Minute = Pick<BerlinClockState, 'minutes' | 'fiveMinutesCell'>;

afterEach(() => {
  cleanup();
});

describe('Berlin Clock', () => {
  it('should render Berlin Clock', () => {
    const { getByTestId, getByRole } = render(<BerlinClock time={moment().format('YYYY/MM/DD')} />);

    const berlin_clock = getByTestId('berlin_clock');
    expect(berlin_clock).toBeInTheDocument();

    const select_zone = getByRole('combobox', { name: 'Select Zone' });
    const select_country = getByRole('combobox', { name: 'Select Country' });

    expect(select_zone).toBeInTheDocument();
    expect(select_country).toBeInTheDocument();
  });

  it('should render Berlin Clock with Belin timezone by default', () => {
    const { getByRole } = render(<BerlinClock />);

    const default_zone = getByRole('option', { name: 'Europe (64)' }) as HTMLOptionElement;
    const default_country = getByRole('option', { name: 'Berlin' }) as HTMLOptionElement;

    expect(default_zone.selected).toBe(true);
    expect(default_country.selected).toBeTruthy();
  });

  it('should display the correct time', () => {
    const { getByTestId } = render(<BerlinClock />);
    const time = moment().tz(`Europe/Berlin`).format('HH:mm:ss ZZ');

    const tz_time = getByTestId('timezone_country_time');

    expect(tz_time).toHaveTextContent(time);
  });

  it('should trigger a time change for a zone without country', async () => {
    const { getByRole, getByTestId } = render(<BerlinClock />);
    const timezone = getByRole('combobox', { name: 'Select Zone' });
    const country = getByRole('combobox', { name: 'Select Country' });

    await userEvent.selectOptions(timezone, getByRole('option', { name: 'Japan' }));

    const select_timezone = getByRole('option', { name: 'Japan' }) as HTMLOptionElement;
    const tz_shown = getByTestId('timezone_country_time') as HTMLSpanElement;
    const tz_japan = moment().tz(`Japan`).format('HH:mm:ss ZZ');

    expect(tz_shown).toHaveTextContent(tz_japan);
    expect(select_timezone.selected).toBeTruthy();
    expect(country).toHaveAttribute('disabled');
  });

  it('should trigger a time change only after a country is selected if there are for the selected zone', async () => {
    const { getByRole, getByTestId } = render(<BerlinClock />);
    const timezone = getByRole('combobox', { name: 'Select Zone' });
    const country = getByRole('combobox', { name: 'Select Country' });
    const tz_berlin = moment().tz(`Europe/Berlin`).format('HH:mm:ss ZZ');

    const tz_shown = getByTestId('timezone_country_time') as HTMLSpanElement;

    await userEvent.selectOptions(timezone, getByRole('option', { name: 'Canada (8)' }));
    const all_options = getAllByRole(country, 'option');

    const tz_berlin_hh_mm = tz_berlin.slice(0, 5);
    const regex = new RegExp(`^${tz_berlin_hh_mm}:\\w+`);
    expect(tz_shown).toHaveTextContent(regex); // still should show timezone for Berlin
    expect(all_options).toHaveLength(9); // 8 country + default
    expect(country).not.toHaveAttribute('disabled');

    await userEvent.selectOptions(country, getByRole('option', { name: 'Pacific' }));
    const tz_shown_after = getByTestId('timezone_country_time') as HTMLSpanElement;

    const tz_canada_pacific = moment().tz('Canada/Pacific').format('HH:mm:ss ZZ');
    const select_country = getByRole('option', { name: 'Pacific' }) as HTMLOptionElement;

    const tz_canada_pacific_hh_mm = tz_canada_pacific.slice(0, 5);
    const regex2 = new RegExp(`^${tz_canada_pacific_hh_mm}:\\w+`);

    expect(tz_shown_after).toHaveTextContent(regex2);
    expect(select_country.selected).toBeTruthy();
  });
});

describe('Convert time to Berlin Clock object', () => {
  it('should convert cell of 5 hours properly', () => {
    const data: BerlinClockState = convertTime('00:00');
    const hours: Hours = { fiveHoursCell: data['fiveHoursCell'] };
    expect(hours).toMatchObject({ fiveHoursCell: ['O', 'O', 'O', 'O'] });

    const data2: BerlinClockState = convertTime('05:00');
    const hours2: Hours = { fiveHoursCell: data2['fiveHoursCell'] };
    expect(hours2).toMatchObject({ fiveHoursCell: ['R', 'O', 'O', 'O'] });

    const data3: BerlinClockState = convertTime('20:00');
    const hours3: Hours = { fiveHoursCell: data3['fiveHoursCell'] };
    expect(hours3).toMatchObject({ fiveHoursCell: ['R', 'R', 'R', 'R'] });
  });

  it('should convert cell of 1 hours properly', () => {
    const data: BerlinClockState = convertTime('05:00');
    const hours: Hour = { fiveHoursCell: data['fiveHoursCell'], hours: data['hours'] };
    expect(hours).toMatchObject({
      fiveHoursCell: ['R', 'O', 'O', 'O'],
      hours: ['O', 'O', 'O', 'O'],
    });

    const data2: BerlinClockState = convertTime('07:00');
    const hours2: Hour = { fiveHoursCell: data2['fiveHoursCell'], hours: data2['hours'] };
    expect(hours2).toMatchObject({
      fiveHoursCell: ['R', 'O', 'O', 'O'],
      hours: ['R', 'R', 'O', 'O'],
    });

    const data3: BerlinClockState = convertTime('14:00');
    const hours3: Hour = { fiveHoursCell: data3['fiveHoursCell'], hours: data3['hours'] };
    expect(hours3).toMatchObject({
      fiveHoursCell: ['R', 'R', 'O', 'O'],
      hours: ['R', 'R', 'R', 'R'],
    });
  });

  it('should convert cell of 5 minutes properly', () => {
    const data: BerlinClockState = convertTime('00:00');
    const minutes: Minutes = { fiveMinutesCell: data['fiveMinutesCell'] };
    expect(minutes).toMatchObject({
      fiveMinutesCell: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    });

    const data2: BerlinClockState = convertTime('00:10');
    const minutes2: Minutes = { fiveMinutesCell: data2['fiveMinutesCell'] };
    expect(minutes2).toMatchObject({
      fiveMinutesCell: ['Y', 'Y', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    });

    const data3: BerlinClockState = convertTime('00:45');
    const minutes3: Minutes = { fiveMinutesCell: data3['fiveMinutesCell'] };
    expect(minutes3).toMatchObject({
      fiveMinutesCell: ['Y', 'Y', 'R', 'Y', 'Y', 'R', 'Y', 'Y', 'R', 'O', 'O'],
    });
  });

  it('should convert cell of 1 minute properly', () => {
    const data: BerlinClockState = convertTime('00:03');
    const minutes: Minute = { fiveMinutesCell: data['fiveMinutesCell'], minutes: data['minutes'] };
    expect(minutes).toMatchObject({
      fiveMinutesCell: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      minutes: ['Y', 'Y', 'Y', 'O'],
    });

    const data2: BerlinClockState = convertTime('00:14');
    const minutes2: Minute = {
      fiveMinutesCell: data2['fiveMinutesCell'],
      minutes: data2['minutes'],
    };
    expect(minutes2).toMatchObject({
      fiveMinutesCell: ['Y', 'Y', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      minutes: ['Y', 'Y', 'Y', 'Y'],
    });

    const data3: BerlinClockState = convertTime('00:32');
    const minutes3: Minute = {
      fiveMinutesCell: data3['fiveMinutesCell'],
      minutes: data3['minutes'],
    };
    expect(minutes3).toMatchObject({
      fiveMinutesCell: ['Y', 'Y', 'R', 'Y', 'Y', 'R', 'O', 'O', 'O', 'O', 'O'],
      minutes: ['Y', 'Y', 'O', 'O'],
    });
  });
});
