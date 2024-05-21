import { render, screen } from '@testing-library/react';
import BerlinClockPage from './BerlinClockPage';

describe('Berlin Clock', () => {
  it('should render Berlin Clock page', () => {
    render(<BerlinClockPage />);
    const title = screen.getByRole('heading', { name: 'Berlin Clock' });

    expect(title).toBeInTheDocument();
  });
});
