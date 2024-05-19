import { Suspense, lazy, FC, ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { useTheme } from '../../context/themeContext';
import styles from './App.module.scss';
import classNames from 'classnames';
import { Layout } from '../Layout';

const Date_Picker_Page = lazy(() => import('../../pages/DatePicker/DatePickerPage'));
const Date_Range_Page = lazy(() => import('../../pages/DateRange/DateRangePage'));
const Berlin_Clock_Page = lazy(() => import('../../pages/BerlinClock/BerlinClockPage'));

const Loader: FC<{ text: string }> = ({ text }) => (
  <div style={{ background: 'hsl(65, 65, 60)' }}>Loading {text}...</div>
);

export const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <div>{'Error element'}</div>,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader text="Berlin Clock page" />}>
            <Berlin_Clock_Page />
          </Suspense>
        ),
      },
      {
        path: 'datepicker',
        element: (
          <Suspense fallback={<Loader text="Date picker page" />}>
            <Date_Picker_Page />
          </Suspense>
        ),
      },
      {
        path: 'daterange',
        element: (
          <Suspense fallback={<Loader text="Date Range page" />}>
            <Date_Range_Page />
          </Suspense>
        ),
      },
      {
        path: 'berlinclock',
        element: (
          <Suspense fallback={<Loader text="Berlin Clock page" />}>
            <Berlin_Clock_Page />
          </Suspense>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: '/',
});

const App: FC<{ children?: ReactNode }> = () => {
  const { theme } = useTheme();

  const theme_classes = classNames(styles[`theme--${theme}`], styles[`theme`]);

  return (
    <div className={theme_classes}>
      <RouterProvider router={router} />
    </div>
  );
};

export { App, Loader };
