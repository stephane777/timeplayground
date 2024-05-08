// import { createRoot } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { App } from '../components/App';
import { describe, expect, test, jest } from '@jest/globals';

import React from 'react';
import ThemeProvider from '../context/themeContext';

const rootMock = {
  render: jest.fn(),
};

jest.mock('react-dom/client', () => ({
  ...jest.requireActual<typeof import('react-dom/client')>('react-dom/client'),
  createRoot: jest.fn(function () {
    return rootMock;
  }),
}));

describe('Render Root DOM', () => {
  test('should renders App', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.append(root);

    require('../index.tsx');

    expect(createRoot).toHaveBeenCalledWith(root);
    expect(rootMock.render).toHaveBeenCalledWith(
      <React.StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    );
  });
});
