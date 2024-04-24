import React, { Suspense, lazy, FC, ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import { useTheme } from '../../context/themeContext';
import styles from './App.module.scss';
import classNames from 'classnames';
import { Layout } from '../Layout';

const Date_Picker_Page = lazy(() => import('../../pages/DatePickerPage'));
const Date_Range_Page = lazy(() => import('../../pages/DateRangePage'));
const Berlin_Clock_Page = lazy(() => import('../../pages/BerlinClockPage'));

import ErrorBoundary from '../../utils/errorBoundaries';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      errorElement: <div>{'Error element'}</div>,
      children: [
        {
          index: true,
          element: <Berlin_Clock_Page />,
        },
        {
          path: 'datePicker',
          element: <Date_Picker_Page />,
        },
        {
          path: 'daterange',
          element: <Date_Range_Page />,
        },
        {
          path: 'berlinclock',
          element: <Berlin_Clock_Page />,
        },
      ],
    },
  ],
  {
    basename: '/',
  }
);

const App: FC<{ children?: ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  const theme_classes = classNames(styles[`theme--${theme}`], styles[`theme`]);

  return (
    <div className={theme_classes}>
      <Suspense fallback={<Loader text="page" />}>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
};

const Loader: FC<{ text: string }> = ({ text }) => (
  <div style={{ background: 'hsl(65, 65, 60)' }}>Loading {text}...</div>
);

export { App };
