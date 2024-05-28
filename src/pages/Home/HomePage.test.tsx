import { logRoles } from '@testing-library/react';
// import { customRender } from '../../utils/testingHelpers/renderWithAllProviders';
import { renderWithRouterV6 } from '../../utils/testingHelpers/renderWithRouterV6';
import HomePage from './HomePage';

describe('Home Range', () => {
  it('should render with 3 main headings', () => {
    const { getByRole } = renderWithRouterV6(<HomePage />);

    const dp_heading = getByRole('heading', { name: /date picker/i });
    const dr_heading = getByRole('heading', { name: /date range/i });
    const bc_heading = getByRole('heading', { name: /berlin clock/i });

    expect(dp_heading).toBeInTheDocument();
    expect(dr_heading).toBeInTheDocument();
    expect(bc_heading).toBeInTheDocument();
  });

  it('should render with 3 screenshots', () => {
    const { container, getByRole } = renderWithRouterV6(<HomePage />);
    logRoles(container);

    const dp_figure = getByRole('figure', { name: /date picker screenshot/i });
    const dr_figure = getByRole('figure', { name: /date range screenshot/i });
    const bc_figure = getByRole('figure', { name: /berlin clock screenshot/i });

    expect(dp_figure).toBeInTheDocument();
    expect(dr_figure).toBeInTheDocument();
    expect(bc_figure).toBeInTheDocument();
  });
});
