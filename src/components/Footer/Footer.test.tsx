import { getAllByRole } from '@testing-library/react';
import Footer from './Footer';
import ThemeProvider from '../../context/themeContext';
import { renderWithRouterV6 } from '../../utils/testingHelpers/renderWithRouterV6';
import { App, routes } from '../App/App';
import { fireEvent } from '@testing-library/react';
import { customRender } from '../../utils/testingHelpers/renderWithAllProviders';

describe('Footer', () => {
  test('Render Footer', () => {
    const { getByRole } = renderWithRouterV6(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>,
      routes
    );

    const nav = getByRole('list', { name: 'footer menu' });
    const tools = getByRole('list', { name: 'footer tools' });
    const copyright = getByRole('list', { name: 'footer copyright' });

    expect(nav).toBeInTheDocument();
    expect(tools).toBeInTheDocument();
    expect(copyright).toBeInTheDocument();
  });
  it('should handle github icon theme', () => {
    const { getByRole, getByTestId, container } = customRender(<App />);

    const github_icon = getByRole('img', { name: 'Github icon link' });
    expect(github_icon).toBeInTheDocument();

    const github_icon_use_dark = getByTestId('github_icon_use');
    expect(github_icon_use_dark).toBeInTheDocument();
    expect(github_icon_use_dark).toHaveAttribute('fill', 'white');

    const toggle_theme_btns = getAllByRole(container, 'button', { name: 'light button' });

    expect(toggle_theme_btns).toHaveLength(2);
    expect(toggle_theme_btns[0]).toHaveAttribute('type', 'button');
    fireEvent.click(toggle_theme_btns[0]);

    const github_icon_use_light = getByTestId('github_icon_use');
    expect(github_icon_use_light).toHaveAttribute('fill', '#0e1624');
  });
});
