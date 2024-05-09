import { render, screen } from '@testing-library/react';

import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '../Layout';
// import BerlinClock from '../BerlinClock/BerlinClock';
// import DatePicker from '../DatePicker/DatePicker';
// import DateRange from '../DateRange/DateRange';

describe('MainNavbar', () => {
  it('MainNavbar render', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<span>Root page</span>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('data-bs-theme', 'light');

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should have a home link', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<span>Root page</span>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const home_link = screen.getByRole('link', { name: 'Time Playground' });
    expect(home_link).toBeInTheDocument();
  });

  it('should have a Date Picker link', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<span>Root page</span>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const datePicker_link = screen.getByRole('link', { name: 'Date Picker' });
    expect(datePicker_link).toBeInTheDocument();
  });

  it('should have a Date Range', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<span>Root page</span>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const dateRange_link = screen.getByRole('link', { name: 'Date Range' });
    expect(dateRange_link).toBeInTheDocument();
  });

  it('should have a Belin clock link', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<span>Root page</span>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const berlinClock_link = screen.getByRole('link', { name: 'Berlin Clock' });
    expect(berlinClock_link).toBeInTheDocument();
  });
});
