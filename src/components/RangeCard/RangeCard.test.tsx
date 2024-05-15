import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import DateRange from '../DateRange/DateRange';

import userEvent from '@testing-library/user-event';
import { Transition } from 'react-transition-group';

import { getTransitionArgs } from '../../utils';

jest.mock('react-transition-group', () => {
  const FakeTransition = jest.fn(({ children }: { children: () => React.ReactNode }) => children());

  return {
    Transition: FakeTransition,
  };
});

beforeEach(() => {
  jest.resetModules();
  render(<DateRange speed={300} />);
  fireEvent.focus(screen.getByRole('textbox', { name: 'date range' }));
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('Range Card with Transition', () => {
  it('should show Range Card & call Transition with default args', () => {
    const ref = document.getElementById('rangeCard_transition_ref');
    const context = expect.any(Object) as unknown;
    const defaultProps = getTransitionArgs(ref);

    expect(Transition).toHaveBeenCalledWith({ in: false, ...defaultProps }, context);
  });

  it('should trigger the Transition and show next month', async () => {
    const ref = document.getElementById('rangeCard_transition_ref');
    const context = expect.any(Object) as unknown;
    const defaultProps = getTransitionArgs(ref);

    const nextIcon = screen.getByRole('img', { name: 'Next Month' });
    await userEvent.click(nextIcon);

    expect(Transition).toHaveBeenCalledTimes(2);
    expect(Transition).toHaveBeenNthCalledWith(1, { in: false, ...defaultProps }, context);
    expect(Transition).toHaveBeenNthCalledWith(2, { in: true, ...defaultProps }, context);
  });
});
