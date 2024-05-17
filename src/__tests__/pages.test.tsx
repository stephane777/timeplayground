import { render, screen } from '@testing-library/react';
import BerlinClockPage from '../pages/BerlinClockPage';
import DateRangePage from '../pages/DateRangePage';
import DatePickerPage from '../pages/DatePickerPage';

const realError = console.error;
const realWarning = console.warn;

beforeEach(() => {
  // avoid noise in console while running test
  // https://github.com/rajinwonderland/react-code-blocks/issues/138
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  console.error = realError;
  console.warn = realWarning;
});

describe('Render all pages', () => {
  it('should render Berlin Clock page', () => {
    render(<BerlinClockPage />);
    const title = screen.getByRole('heading', { name: 'Berlin Clock' });

    expect(title).toBeInTheDocument();
  });

  it('should render Date Picker page', () => {
    render(<DatePickerPage />);

    const title = screen.getByRole('heading', { name: 'Date Picker' });
    expect(title).toBeInTheDocument();
  });

  it('should render Date Picker page', () => {
    render(<DateRangePage />);

    const title = screen.getByRole('heading', { name: 'Date Range' });
    expect(title).toBeInTheDocument();
  });
});
