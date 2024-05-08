import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleTheme from './ToggleTheme';
import ThemeProvider from '../../context/themeContext';
import { ThemeContext } from '../../context/themeContext';

describe('ToggleTheme', () => {
  test('default value without any Provider match', () => {
    render(<ThemeContext.Consumer>{({ theme }) => <span>{theme}</span>}</ThemeContext.Consumer>);
    expect(screen.getByText('light')).toBeInTheDocument();
  });

  test('toggle theme icon should be dark at initial render', () => {
    render(
      <ThemeProvider>
        <ToggleTheme />
      </ThemeProvider>
    );
    const dark_button = screen.getByRole('button', { name: 'dark button' });
    const light_button = screen.queryByRole('button', { name: 'light button' });
    expect(dark_button).toBeInTheDocument();
    expect(light_button).not.toBeInTheDocument();
  });

  test('toggle theme icon clicked once should be light button', () => {
    render(
      <ThemeProvider>
        <ToggleTheme />
      </ThemeProvider>
    );
    const dark_btn = screen.getByRole('button', { name: 'dark button' });
    fireEvent.click(dark_btn);

    const light_btn = screen.getByRole('button', { name: 'light button' });
    const dark_btn_after = screen.queryByRole('button', { name: 'dark button' });
    expect(light_btn).toBeInTheDocument();
    expect(dark_btn_after).not.toBeInTheDocument();
  });
});
