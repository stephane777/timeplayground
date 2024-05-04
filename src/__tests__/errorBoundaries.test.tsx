import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../utils/errorBoundaries';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

describe('Error boundary', () => {
  const realError = console.error;

  const ThrowError = () => {
    throw new Error('Test error boundary!');
  };

  const renderWithRouter = (ui: ReactNode, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);

    return {
      user: userEvent.setup(),
      ...render(ui, { wrapper: BrowserRouter }),
    };
  };

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = realError;
  });

  test('renders its children', () => {
    render(
      <ErrorBoundary>
        <p>Render the children</p>
      </ErrorBoundary>
    );

    expect(screen.queryByTestId('errorboundary')).toBeNull();
    expect(screen.getByText('Render the children', { exact: true })).toBeInTheDocument();
  });

  test('should trigger a console.error', () => {
    // need a router wrapper here because Error boundary will return a JSX.Element containing a Link from react-router-dom
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError />
        <p>Render the children</p>
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
    expect(screen.getByTestId('errorboundary')).toBeInTheDocument();
    expect(screen.queryByText('Render the children', { exact: false })).toBeNull();
  });
});
