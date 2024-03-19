import React, { FC, ReactNode } from 'react';
import MainNavbar from '../MainNavbar/MainNavbar';
import { useTheme } from '../../context/themeContext';
import styles from './App.module.scss';
import classNames from 'classnames';
import DatePicker from '../DatePicker/DatePicker';
import Container from 'react-bootstrap/Container';

const App: FC = () => {
  const { theme } = useTheme();

  const classes = classNames(styles[`theme--${theme}`], styles[`theme`]);

  return (
    <div className={classes}>
      <header>
        <MainNavbar />
      </header>
      <main>
        <Container fluid="sm">
          <div className={styles[`container__datePicker`]}>
            <DatePicker />
          </div>
        </Container>
      </main>
      <footer></footer>
    </div>
  );
};

export { App };
