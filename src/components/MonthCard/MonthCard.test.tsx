import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import DatePicker from '../DatePicker/DatePicker';
import moment from 'moment';
import userEvent from '@testing-library/user-event';
import { Transition } from 'react-transition-group';

jest.mock('react-transition-group', () => {
  const FakeTransition = jest.fn(({ children }: { children: () => React.ReactNode }) => children());

  return {
    Transition: FakeTransition,
  };
});

const getTransitionArgs = (ref: HTMLElement | null) => {
  return {
    children: expect.any(Function) as () => React.ReactNode,
    nodeRef: { current: ref as unknown },
    onEntered: expect.any(Function) as () => void,
    onExited: expect.any(Function) as () => void,
    timeout: { exit: 300 },
  };
};

beforeEach(() => {
  jest.resetModules();
  render(<DatePicker speed={300} />);
  fireEvent.focus(screen.getByRole('textbox'));
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('Month Card with Transition', () => {
  it('should show the Month Card & call Transition with args', () => {
    const today = moment().format('DD/MM/YYYY');

    expect(screen.queryByDisplayValue(today)).toBeInTheDocument();

    const ref = document.getElementById('monthCard_transition_ref');
    const context = expect.any(Object) as unknown;
    const defaultProps = getTransitionArgs(ref);

    expect(Transition).toHaveBeenCalledWith({ in: false, ...defaultProps }, context);
  });

  it('should trigger the Transition and show next month', async () => {
    const ref = document.getElementById('monthCard_transition_ref');
    const context = expect.any(Object) as unknown;
    const defaultProps = getTransitionArgs(ref);

    const nextIcon = screen.getByRole('img', { name: 'Next Month' });
    await userEvent.click(nextIcon);

    expect(Transition).toHaveBeenCalledTimes(2);
    expect(Transition).toHaveBeenNthCalledWith(1, { in: false, ...defaultProps }, context);
    expect(Transition).toHaveBeenNthCalledWith(2, { in: true, ...defaultProps }, context);
  });

  // it('should show the next month after click the next month button')
  // it('should show the previous month after click the previous month button')
});
