import { render } from '@testing-library/react';
// import { userEvent } from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, RouteObject } from 'react-router-dom';
import { isValidElement, ReactNode } from 'react';
import userEvent from '@testing-library/user-event';

export function renderWithRouterV6(
  children: ReactNode | Pick<RouteObject, 'element' | 'path'>,
  routes: RouteObject[] = []
) {
  const options = isValidElement(children)
    ? { element: children, path: '/' }
    : (children as Pick<RouteObject, 'element' | 'path'>);

  const router = createMemoryRouter([{ ...options }, ...routes], {
    initialEntries: [options.path as string],
    initialIndex: 1,
  });

  return {
    user: userEvent.setup(),
    ...render(<RouterProvider router={router} />),
  };
}
