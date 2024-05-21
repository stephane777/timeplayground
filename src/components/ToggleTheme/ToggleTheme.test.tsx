import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleTheme from './ToggleTheme';
import ThemeProvider from '../../context/themeContext';
import { ThemeContext } from '../../context/themeContext';

describe('ToggleTheme', () => {
  test('default value without any Provider match', () => {
    render(<ThemeContext.Consumer>{({ theme }) => <span>{theme}</span>}</ThemeContext.Consumer>);
    expect(screen.getByText('dark')).toBeInTheDocument();
  });

  test('toggle theme icon should be light at initial render', () => {
    // if it's already dark should we show the light icon right ?
    render(
      <ThemeProvider>
        <ToggleTheme />
      </ThemeProvider>
    );
    const light_button = screen.getByRole('button', { name: 'light button' });
    const dark_button = screen.queryByRole('button', { name: 'dark button' });
    expect(dark_button).not.toBeInTheDocument();
    expect(light_button).toBeInTheDocument();
  });

  test('toggle theme icon clicked once should be light button', () => {
    render(
      <ThemeProvider>
        <ToggleTheme />
      </ThemeProvider>
    );
    const light_btn = screen.getByRole('button', { name: 'light button' });
    fireEvent.click(light_btn);

    const dark_btn = screen.getByRole('button', { name: 'dark button' });
    const light_btn_after = screen.queryByRole('button', { name: 'light button' });

    expect(dark_btn).toBeInTheDocument();
    expect(light_btn_after).not.toBeInTheDocument();
  });
});
