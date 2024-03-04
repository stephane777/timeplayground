import React, { FC, ReactNode } from 'react';
import MainNavbar from '../MainNavbar/MainNavbar';
import { useTheme } from '../../context/themeContext';
import styles from './App.module.scss';
import classNames from 'classnames';

const App: FC = () => {
  const { theme } = useTheme();

  const classes = classNames(styles[`theme--${theme}`], styles[`theme`]);

  return (
    <div className={classes}>
      <header>
        <MainNavbar />
      </header>
      <main></main>
      <footer></footer>
    </div>
  );
};

export { App };
