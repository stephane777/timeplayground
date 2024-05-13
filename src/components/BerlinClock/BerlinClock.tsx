import React, { useState, useEffect, FC, SetStateAction } from 'react';
import moment from 'moment';
import moment_tz from 'moment-timezone';
import classNames from 'classnames';
import styles from './BerlinClock.module.scss';
import { useTheme } from '../../context/themeContext';
import FormSelect from 'react-bootstrap/FormSelect';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const cx = classNames.bind(styles);

export interface BerlinClockProps {
  time?: string | null; // 15:45:06
}

export interface BerlinClockState {
  second: 'Y' | 'O';
  fiveHoursCell: Array<'R' | 'O'>;
  hours: Array<'R' | 'O'>;
  fiveMinutesCell: Array<'R' | 'Y' | 'O'>;
  minutes: Array<'Y' | 'O'>;
}

interface BerlinClockTimezoneState {
  zone: string;
  country?: string;
}

interface TimezonesProps {
  all_timezones: Categorized_tz;
  theme: ReturnType<typeof useTheme>['theme'];
  selectedTimezone: BerlinClockTimezoneState;
  setSelectedTimezone: React.Dispatch<SetStateAction<BerlinClockTimezoneState>>;
}

type Categorized_tz = Record<string, string[]>;

export const convertTime = (time: string): BerlinClockState => {
  const [h, m, s] = time.split(':').map(Number);
  return {
    second: s % 2 ? 'O' : 'Y',
    fiveHoursCell: Array.from({ length: 4 })
      .fill('O')
      .map((_, index) => {
        return h >= (index + 1) * 5 ? 'R' : 'O';
      }),
    hours: Array.from({ length: 4 })
      .fill('O')
      .map((_, index) => {
        return h % 5 >= index + 1 ? 'R' : 'O';
      }),
    fiveMinutesCell: Array.from({ length: 11 })
      .fill('O')
      .map((_, index) => {
        const total = (index + 1) * 5;
        return m >= (index + 1) * 5 ? (total % 15 === 0 ? 'R' : 'Y') : 'O';
      }),
    minutes: Array.from({ length: 4 })
      .fill('O')
      .map((_, index) => {
        return m % 5 >= index + 1 ? 'Y' : 'O';
      }),
  };
};

const BerlinClock: FC<BerlinClockProps> = () => {
  const [selectedTimezone, setSelectedTimezone] = useState<{ zone: string; country?: string }>({
    zone: 'Europe',
    country: 'Berlin',
  });
  const [state, setState] = useState<BerlinClockState>(() =>
    convertTime(
      moment().tz(`${selectedTimezone.zone}/${selectedTimezone.country}`).format('HH:mm:ss')
    )
  );
  const intervalId = React.useRef<ReturnType<typeof setInterval>>();
  const { theme } = useTheme();

  useEffect(() => {
    intervalId.current = setInterval(() => {
      const param_tz = selectedTimezone.country
        ? `${selectedTimezone.zone}/${selectedTimezone.country}`
        : selectedTimezone.zone;
      const newTime = convertTime(moment().tz(param_tz).format('HH:mm:ss'));

      setState(newTime);
    }, 1000);
    return () => clearInterval(intervalId.current);
  }, [selectedTimezone]);

  const all_timezones = React.useMemo(() => {
    const tz_names = moment_tz.tz.names();

    return tz_names.reduce<Categorized_tz>((result, tz) => {
      const [zone, country_tmp, city] = tz.split('/');
      const country = city ? `${country_tmp}/${city}` : country_tmp;
      return {
        ...result,
        [zone]:
          country && result[zone]?.length > 0
            ? [...result[zone], country]
            : country
              ? [country]
              : [],
      };
    }, {});
  }, []);

  const second_classes = classNames(
    styles['berlinClock__second'],
    styles[
      cx({
        [`berlinClock__second--${state.second}`]: true,
      })
    ]
  );

  const digital_time_classes = classNames(
    styles['berlinClock__time'],
    styles[
      cx({
        [`berlingClock__time--${theme}`]: true,
      })
    ]
  );

  return (
    <div
      data-testid="berlin_clock"
      className="d-flex flex-column align-items-center justify-content-center mt-5"
    >
      {/** SECOND*/}
      <div className={second_classes}></div>
      <div className={styles['berlinClock__join']}></div>
      {/** hours cell 5h*/}
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell cells={state.fiveHoursCell} />
      </div>
      {/** hours cell 1h*/}
      <div className="d-flex">
        <div className={styles['berlinClock__join']}></div>
        <div className={styles['berlinClock__join']}></div>
      </div>
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell cells={state.hours} />
      </div>
      {/** minutes cell 5min*/}
      <div className="d-flex ">
        <div className={styles['berlinClock__join']}></div>
        <div className={styles['berlinClock__join']}></div>
      </div>
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell cells={state.fiveMinutesCell} />
      </div>
      {/** minutes cell 1min*/}
      <div className="d-flex ">
        <div className={styles['berlinClock__join']}></div>
        <div className={styles['berlinClock__join']}></div>
      </div>
      <div className={styles['berlinClock__row-cells-container']}>
        <BuildCell cells={state.minutes} />
      </div>
      <span data-testid="timezone_country_time" className={digital_time_classes}>
        {selectedTimezone.country
          ? moment()
              .tz(`${selectedTimezone.zone}/${selectedTimezone.country}`)
              .format('HH:mm:ss ZZ')
          : moment().tz(selectedTimezone.zone).format('HH:mm:ss ZZ')}
      </span>
      <hr />

      {all_timezones ? (
        <TimezonesWithMemo
          setSelectedTimezone={setSelectedTimezone}
          selectedTimezone={selectedTimezone}
          theme={theme}
          all_timezones={all_timezones}
        />
      ) : (
        <LoadingTz text="Loading timezone" />
      )}
    </div>
  );
};

const LoadingTz: FC<{ text: string }> = ({ text }) => {
  return <h4>{text}</h4>;
};

const BuildCell: FC<{ cells: Array<'Y' | 'R' | 'O'> }> = ({ cells }) => {
  return cells?.map((cell, index) => {
    const cell_classNames = classNames(
      styles['berlinClock__row-cell'],
      styles[
        cx({
          [`berlinClock__row-cell--${cell}`]: true,
        })
      ]
    );
    return <div key={index} className={cell_classNames}></div>;
  });
};

const Timezones: React.FC<TimezonesProps> = ({
  all_timezones,
  theme,
  selectedTimezone,
  setSelectedTimezone,
}) => {
  const [zoneHasCountry, setZoneHasCountry] = useState<string | null>(
    selectedTimezone.zone || null
  );

  const handleZoneChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    event.preventDefault();
    const zone = event?.target?.value;

    if (all_timezones[zone]?.length > 0) {
      setZoneHasCountry(zone);
    } else {
      setSelectedTimezone({ zone: event?.target.value });
      setZoneHasCountry(null);
    }
  };

  const handleCountryChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    event.preventDefault();
    const country = event?.target?.value;

    if (zoneHasCountry) {
      setSelectedTimezone({ zone: zoneHasCountry, country });
    }
  };
  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="3">
          <FormSelect
            data-bs-theme={theme}
            aria-label="Select Zone"
            className={styles['berlinClock__dropdown']}
            onChange={handleZoneChange}
            defaultValue={selectedTimezone.zone}
          >
            <option>Select zone</option>
            {Object.keys(all_timezones)

              .map((tz, index) => {
                const timez =
                  all_timezones[tz]?.length > 0 ? `${tz} (${all_timezones[tz].length})` : tz;

                return (
                  <option value={tz} key={`${index}-${tz}`}>
                    {timez}
                  </option>
                );
              })}
          </FormSelect>
        </Col>
        <Col lg="3">
          <FormSelect
            disabled={!selectedTimezone.country && !zoneHasCountry}
            data-bs-theme={theme}
            aria-label="Select Country"
            className={styles['berlinClock__dropdown']}
            onChange={handleCountryChange}
            defaultValue={selectedTimezone.country}
          >
            <option>{'Select Country'}</option>
            {zoneHasCountry &&
              all_timezones[zoneHasCountry]?.map((country, index) => {
                return (
                  <option value={country} key={`${index}-${country}`}>
                    {country}
                  </option>
                );
              })}
          </FormSelect>
        </Col>
      </Row>
    </Container>
  );
};

const TimezonesWithMemo = React.memo(Timezones);

export { BerlinClock };
