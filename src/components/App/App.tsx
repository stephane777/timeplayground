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
      <MainNavbar />
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti ea, aut vel aliquid
        mollitia, deserunt et quibusdam perferendis amet consectetur porro praesentium cupiditate
        eius animi natus dolorum, asperiores cum quasi!
      </p>
    </div>
  );
};

export { App };
