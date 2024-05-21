import { render, screen } from '@testing-library/react';

import DateRangePage from './DateRangePage';

describe('Render Date Range', () => {
  it('should render Date Picker page', () => {
    render(<DateRangePage />);

    const title = screen.getByRole('heading', { name: 'Date Range' });
    expect(title).toBeInTheDocument();
  });
});
