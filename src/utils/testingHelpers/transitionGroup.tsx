export const getTransitionArgs = (ref: HTMLElement | null) => {
  return {
    children: expect.any(Function) as () => React.ReactNode,
    nodeRef: { current: ref as unknown },
    onEntered: expect.any(Function) as () => void,
    onExited: expect.any(Function) as () => void,
    timeout: { exit: 300 },
  };
};
