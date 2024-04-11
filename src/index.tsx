import React from 'react';
import { createRoot } from 'react-dom/client';
import ThemeProvider from './context/themeContext';
import './styles/main.scss';
import { App } from './components/App/App';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
// import DatePicker from './components/DatePicker/DatePicker';
import DateRange from './components/DateRange/DateRange';
import DatePickerDemo from './components/DatePicker/DatePickerDemo';
import ErrorBoundary from './utils/errorBoundaries';
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <App>
          <DateRange />
        </App>
      ),
      errorElement: <div>{'Error element'}</div>,
    },
    {
      path: 'daterange',
      element: (
        <App>
          <DateRange />
        </App>
      ),
    },
    {
      path: 'datePicker',
      element: (
        <App>
          <DatePickerDemo />,
        </App>
      ),
    },
  ],
  {
    // basename: '/',
  }
);
const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
