import React, { FC, ReactNode } from 'react';
import MainNavbar from '../MainNavbar/MainNavbar';
import DateRange from '../DateRange/DateRange';
import { useTheme } from '../../context/themeContext';
import styles from './App.module.scss';
import classNames from 'classnames';
import DatePicker from '../DatePicker/DatePicker';
import Container from 'react-bootstrap/Container';
import DatePickerDemo from '../DatePicker/DatePickerDemo';
// import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from '../../utils/errorBoundaries';

const App: FC<{ children: ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  const theme_classes = classNames(styles[`theme--${theme}`], styles[`theme`]);

  return (
    <ErrorBoundary>
      {/* <Router> */}
      <div className={theme_classes}>
        <header>
          <MainNavbar />
        </header>
        <main>
          <Container fluid="sm" className="pt-5">
            {children}
          </Container>
        </main>
        <footer className="my-5">Footer</footer>
      </div>
      {/* </Router> */}
    </ErrorBoundary>
  );
};

export { App };
