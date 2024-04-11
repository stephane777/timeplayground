import React, { FC, ReactNode } from 'react';
import MainNavbar from '../MainNavbar/MainNavbar';
import { useTheme } from '../../context/themeContext';
import styles from './App.module.scss';
import classNames from 'classnames';
import DatePicker from '../DatePicker/DatePicker';
import Container from 'react-bootstrap/Container';
import DatePickerDemo from '../DatePicker/DatePickerDemo';

import ErrorBoundary from '../../utils/errorBoundaries';

const App: FC = () => {
  const { theme } = useTheme();

  const theme_classes = classNames(styles[`theme--${theme}`], styles[`theme`]);

  return (
    <ErrorBoundary>
      <div className={theme_classes}>
        <header>
          <MainNavbar />
        </header>
        <main>
          <Container fluid="sm" className="pt-5">
            <section>
              <h1>Date Picker</h1>
              <div className={styles[`container__datePicker`]}>
                <DatePicker speed={300} />
              </div>
            </section>
            <DatePickerDemo />
          </Container>
        </main>
        <footer className="my-5">Footer</footer>
      </div>
    </ErrorBoundary>
  );
};

export { App };
