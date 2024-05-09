import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import ThemeProvider from '../../context/themeContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });
