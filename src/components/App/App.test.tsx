import { renderWithRouterV6 } from '../../utils/testingHelpers/renderWithRouterV6';
import { App, routes } from './App';
import { Layout } from '../Layout';
import { customRender } from '../..//utils/testingHelpers/renderWithAllProviders';
import { screen } from '@testing-library/react';
import DatePicker from '../DatePicker/DatePicker';

const MockedBerlinClockedPage = () => {
  return <div>{'Mocked Berlin Clock pages'}</div>;
};

const MockedDatePickerPage = () => {
  return <div>{'Mocked Date Picker pages'}</div>;
};

const MockedDateRangePage = () => {
  return <div>{'Mocked Date Range pages'}</div>;
};

jest.mock('../../pages/BerlinClock/BerlinClockPage', () => {
  return jest.fn(() => <MockedBerlinClockedPage />);
});

jest.mock('../../pages/DatePicker/DatePickerPage', () => {
  return jest.fn(() => <MockedDatePickerPage />);
});

jest.mock('../../pages/DateRange/DateRangePage', () => {
  return jest.fn(() => <MockedDateRangePage />);
});

describe('Navigate through App', () => {
  it('should show loading component at initial render ( lazy loading)', () => {
    const { getByText } = renderWithRouterV6(<Layout />, routes);

    const loading_text = getByText(/Loading Berlin Clock page/, { exact: false });
    expect(loading_text).toBeInTheDocument();
  });

  it('should lazy load Berlin Clock on initial render', async () => {
    const { findByText } = renderWithRouterV6(<Layout />, routes);

    const mocked_bc = await findByText(/Mocked Berlin Clock pages/i);
    expect(mocked_bc).toBeInTheDocument();
  });

  it('should navigate to Date Picker page', async () => {
    const { findByText, getByRole, user } = renderWithRouterV6(<Layout />, routes);

    const mocked_bc = await findByText(/Mocked Berlin Clock pages/i);
    expect(mocked_bc).toBeInTheDocument();

    const link = getByRole('link', { name: 'Date Picker' });
    expect(link).toBeInTheDocument();

    await user.click(link);

    const mocked_dp = await findByText(/Mocked Date Picker pages/i);
    expect(mocked_dp).toBeInTheDocument();
  });

  it('should navigate to Date Range page', async () => {
    const { findByText, getByRole, user } = renderWithRouterV6(<Layout />, routes);

    const mocked_bc = await findByText(/Mocked Berlin Clock pages/i);
    expect(mocked_bc).toBeInTheDocument();

    const link = getByRole('link', { name: 'Date Range' });
    expect(link).toBeInTheDocument();

    await user.click(link);

    const mocked_dr = await findByText(/Mocked Date Range pages/i);
    expect(mocked_dr).toBeInTheDocument();
  });
});

describe('Render App', () => {
  it('should render App without crashing', () => {
    customRender(<App />);

    const mocked_bc = screen.getByText(/Mocked Berlin Clock pages/, { exact: false });
    expect(mocked_bc).toBeInTheDocument();
  });
  it('should render any component', () => {
    const { getByRole } = renderWithRouterV6({
      element: <DatePicker speed={300} />,
      path: '/',
    });

    const input = getByRole('textbox', { name: 'date picker' });
    const img = getByRole('img', { name: 'date picker icon' });

    expect(input).toBeInTheDocument();
    expect(img).toBeInTheDocument();
  });
});
