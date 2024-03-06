import React, { FC, ReactNode } from 'react';
import MainNavbar from '../MainNavbar/MainNavbar';
import { useTheme } from '../../context/themeContext';
import styles from './App.module.scss';
import classNames from 'classnames';
import DatePicker from '../DatePicker/DatePicker';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const App: FC = () => {
  const { theme } = useTheme();
  const [isFocused, setFocused] = React.useState(false);

  const classes = classNames(styles[`theme--${theme}`], styles[`theme`]);

  return (
    <div className={classes}>
      <header>
        <MainNavbar />
      </header>
      <main>
        <Container fluid="sm">
          <div className={styles[`container__datePicker`]}>
            <DatePicker onFocusChange={(focused) => setFocused(focused)} focused={isFocused} />
          </div>
        </Container>
      </main>
      <footer></footer>
    </div>
  );
};

export { App };
