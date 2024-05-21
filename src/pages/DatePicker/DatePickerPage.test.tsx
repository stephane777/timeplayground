import { render, screen } from '@testing-library/react';
import DatePickerPage from './DatePickerPage';

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

describe('Render Date Picker', () => {
  it('should render Date Picker page', () => {
    render(<DatePickerPage />);

    const title = screen.getByRole('heading', { name: 'Date Picker' });
    expect(title).toBeInTheDocument();
  });
});
