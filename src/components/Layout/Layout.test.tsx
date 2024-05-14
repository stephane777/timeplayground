import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('Layout', () => {
  test('Layout test render', () => {
    const FakeComponent = () => <div>fake text</div>;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<FakeComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(4);

    // test Outlet
    expect(screen.queryByText('fake text')).toBeInTheDocument();
  });
});
