import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { ReactNode } from 'react';

export const renderWithRouter = (
  ui: ReactNode,
  { route = '/' } = {}
  // ): RenderResult & { user: UserEvent } => {
) => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  };
};
