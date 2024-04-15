export default {
  transition: `import React, { forwardRef, useRef, useState, Dispatch, MouseEvent, CSSProperties } from 'react';
  import { Transition, TransitionStatus } from 'react-transition-group';
  type TransitionStyle = {
    [P in TransitionStatus]: CSSProperties;
  };
  const MonthCard: React.ForwardRefExoticComponent<
  React.RefAttributes<HTMLDivElement> & MonthCardProps
> = forwardRef(function (
  { time, setTime, selectedDay, setSelectedDay, speed, demo, demoWithNoKey },
  ref
) {
    const [activeTransition, setActiveTransition] = useState<boolean>(false);
    const [inProp, setInProp] = useState<boolean>(false);
    const [nextOrPrev, setNextOrPrev] = useState<boolean | null>(null);
    {\`...\`}
    const defaultStyle: CSSProperties = {
        transition: \`transform \${speed}ms ease-in-out\`,
        transform: 'translateX(0)',
        position: 'absolute',
        top: '0',
        left: nextOrPrev && activeTransition ? '0' : !nextOrPrev && activeTransition ? '-204px' : '0',
      };
    
      const transitionStyles: TransitionStyle = {
        entering: { transform: 'translateX(0)' },
        entered: { transform: 'translateX(0)' },
        exiting: { transform: \`translateX(\${nextOrPrev ? '-50%' : '50%'})\` },
        exited: { transform: 'translateX(0)' },
        unmounted: { transform: 'translateX(0)' },
      };
      return(
        <div>
        {\`...\`}
        <Transition
        in={inProp}
        timeout={{
          exit: speed,
        }}
        nodeRef={nodeRef}
        onEntered={() => {
          setInProp(false);
        }}
        onExited={() => {
          handleToggleMonth(nextOrPrev ? 1 : -1);
        }}
      >
       {\`...\`}
      </Transition>
        </div>
      )
}
    `,
  render2months: `const MonthCard: React.ForwardRefExoticComponent<
    React.RefAttributes<HTMLDivElement> & MonthCardProps
  > = forwardRef(function (
    { time, setTime, selectedDay, setSelectedDay, speed, demo, demoWithNoKey },
    ref
  ) {
    // when activeTransition is true react render prev, current & next month needed for the animation
  const [activeTransition, setActiveTransition] = useState<boolean>(false);

  // react-transition-group Transition state
  const [inProp, setInProp] = useState<boolean>(false);

  // state to handle which month the user is toggling is previous or next month
  const [nextOrPrev, setNextOrPrev] = useState<boolean | null>(null);
  
    {\`...\`}
    return (
            <div>
              <div className={togglemonth_classes}>
              {/* Previous month */}
                <svg
                  className={icon_prev_classes}
                  onClick={() => {
                    setActiveTransition(true);
                    setInProp(true);
                    setNextOrPrev(false);
                  }}
                >
                  <use href={\`\${sprite}#icon-triangle-left\`} className="text"></use>
                </svg>
                <span>{\`\${param.fullMonth} \${param.year}\`}</span>
                {/* Next month ! */}
                <svg
                  className={icon_next_classes}
                  onClick={() => {
                    setActiveTransition(true);
                    setInProp(true);
                    setNextOrPrev(true);
                  }}
                >
                  <use href={\`\${sprite}#icon-triangle-right\`}> </use>
                </svg>
              </div>
              <div className={weekDay_classes}>{weekHeader}</div>
            </div>)
            {\`...\`}
    }`,
};
