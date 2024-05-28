import { renderWithRouterV6 } from '../../utils/testingHelpers/renderWithRouterV6';
import { App, routes } from './App';
import { Layout } from '../Layout';
import { customRender } from '../..//utils/testingHelpers/renderWithAllProviders';
import DatePicker from '../DatePicker/DatePicker';

const MockedBerlinClockedPage = () => {
  return <div>{'Mocked Berlin Clock page'}</div>;
};

const MockedDatePickerPage = () => {
  return <div>{'Mocked Date Picker page'}</div>;
};

const MockedDateRangePage = () => {
  return <div>{'Mocked Date Range page'}</div>;
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
  it('should show home page at initial render', () => {
    const { getAllByRole } = renderWithRouterV6(<Layout />, routes);

    const headings = getAllByRole('heading');
    expect(headings).toHaveLength(9);
  });

  it('should navigate to Date Picker page', async () => {
    const { findByText, getByRole, user } = renderWithRouterV6(<Layout />, routes);

    const link = getByRole('link', { name: 'Date Picker' });
    expect(link).toBeInTheDocument();

    await user.click(link);

    const mocked_dp = await findByText(/Mocked Date Picker page/i);
    expect(mocked_dp).toBeInTheDocument();
  });

  it('should navigate to Date Range page', async () => {
    const { findByText, getByRole, user } = renderWithRouterV6(<Layout />, routes);

    const link = getByRole('link', { name: 'Date Range' });
    expect(link).toBeInTheDocument();

    await user.click(link);

    const mocked_dr = await findByText(/Mocked Date Range page/i);
    expect(mocked_dr).toBeInTheDocument();
  });
});

describe('Render App', () => {
  it('should render App without crashing', () => {
    const { getAllByRole } = customRender(<App />);

    const home_page_headings = getAllByRole('heading');
    expect(home_page_headings).toHaveLength(9);
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
