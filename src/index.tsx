import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import ThemeProvider from './context/themeContext';
import './styles/main.scss';
import { App } from './components/App/App';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
