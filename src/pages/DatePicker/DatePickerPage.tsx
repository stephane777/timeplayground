import React, { FC, useRef, MouseEvent, useState, useEffect, useCallback, useMemo } from 'react';
import { CopyBlock, hybrid } from 'react-code-blocks';
import { ButtonGroup } from 'react-bootstrap';
import { useTheme } from '../../context/themeContext';
import DatePicker from '../../components/DatePicker/DatePicker';
import codeblocks from '../../codeblocks/datepicker_cb';
import classNames from 'classnames';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Figure from 'react-bootstrap/Figure';
import styles from './DatePickerPage.module.scss';
import Badge from 'react-bootstrap/Badge';
import Tabs from 'react-bootstrap/Tabs';
import img2 from '../../assets/img/png/MonthCard_next_dark.png';
import img1 from '../../assets/img/png/MonthCard_prev_dark.png';
import img4 from '../../assets/img/png/MonthCard_next_light.png';

import img3 from '../../assets/img/png/MonthCard_prev_light.png';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const cx = classNames.bind(styles);

const DatePickerPage: FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { theme } = useTheme();
  const overview_ref = useRef<HTMLElement | null>(null);
  const render_2_month_ref = useRef<HTMLElement | null>(null);
  const transition_ref = useRef<HTMLElement | null>(null);
  const render_selected = useRef<HTMLElement | null>(null);
  const all_refs = useMemo(
    () => [overview_ref, render_2_month_ref, transition_ref, render_selected],
    []
  );

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;

    all_refs?.forEach((section) => {
      let offsetTop = section?.current?.offsetTop;
      let offsetHeight = section?.current?.offsetHeight;
      offsetTop = offsetTop ? offsetTop - 200 : 0;
      offsetHeight = offsetHeight ? offsetHeight - 200 : 0;

      if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
        const newActiveSection = section.current?.dataset?.section;

        if (newActiveSection) {
          setActiveSection(newActiveSection);
        }
      }
    });
  }, [all_refs]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleScrollToRef = (
    e: MouseEvent<HTMLButtonElement>,
    ref: React.MutableRefObject<HTMLElement | null>
  ) => {
    e.preventDefault();
    if (ref.current) {
      scrollTo({ top: ref?.current?.offsetTop - 90, behavior: 'smooth' });
    }
  };

  const sidebar_btn_classes = (btn: string) =>
    classNames(
      styles[
        cx({
          [`datePickerPage__sidebar-btn`]: true,
        })
      ],
      styles[
        cx({
          [`datePickerPage__sidebar-btn--active`]: btn === activeSection,
        })
      ]
    );

  return (
    <Container fluid="sm" className={styles[`datePickerPage__wrapper`]}>
      <Row className="mb-7">
        <Col xxl={9}>
          <Container className="flex">
            <section className="mt-0">
              <h1 className="">Date Picker</h1>
              <div className={styles[`datePickerPage__container`]}>
                <div className="mt-7">
                  <DatePicker speed={300} />
                </div>
              </div>
            </section>

            <section ref={overview_ref} data-section="overview">
              <h2 className="my-5">Overview:</h2>
              <p>
                This was a project I&apos;ve build few years back and it is time to refresh it with
                type safty and a smooth animation with{' '}
                <Button
                  data-bs-theme={theme}
                  className="p-0 text-decoration-none border-0 align-baseline"
                  variant="link"
                  href="https://reactcommunity.org/react-transition-group/"
                >
                  react-transition-group
                </Button>
                . The date picker is built with Form.Control type=&apos;text&apos; from{' '}
                <Button
                  data-bs-theme={theme}
                  className="p-0 text-decoration-none border-0 align-baseline"
                  variant="link"
                  href="https://react-bootstrap.netlify.app/"
                >
                  React Bootstrap
                </Button>{' '}
                package. The dropdown is entirely built with React. Before jumping into details
                let&apos;s break down what we need to achieve. First when the user click the arrow
                right or left we need to render 2 months side by side. Then the transition is active
                for few milliseconds. When the animation is ending setting the new state{' '}
                <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                  time
                </Badge>{' '}
                which will render the new month.
              </p>
            </section>
            <section ref={render_2_month_ref} data-section="render_2_month">
              <h2 className="my-5">Render current month & next or previous month: </h2>

              <Container>
                <Tabs
                  defaultActiveKey="description"
                  id="render_2_months"
                  className="mb-3"
                  data-bs-theme={theme}
                >
                  <Tab eventKey="description" title="Description">
                    <Row className="mt-5">
                      <Col lg="3">
                        <div className={styles[`datePickerPage__container`]}>
                          <DatePicker
                            showLabel={false}
                            speed={1000}
                            demo="render2month"
                            demoWithNoKey={false}
                          />
                        </div>
                      </Col>
                      <Col lg="9">
                        <p>
                          When the date picker is rendered the first time the previous and next
                          month are both stored in 2 variables ready to be used when the transition
                          is triggered.
                          <br /> Clicking the arrow left will render the MonthCard component with
                          the current month along with the previous month on the left.
                          <br /> To handle the different phase we need 3 pieces of state:
                        </p>
                        <ol>
                          <li>
                            <p>
                              <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                                activeTransition
                              </Badge>{' '}
                              when true the date picker is rendered with 2 months.
                            </p>
                          </li>
                          <li>
                            <p>
                              <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                                inProp
                              </Badge>{' '}
                              state is needed for react-transition-group Transition component
                            </p>
                          </li>
                          <li>
                            <p>
                              <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                                nextOrPrev
                              </Badge>{' '}
                              state to handle which month previous or next the user want to see.
                            </p>
                          </li>
                        </ol>
                      </Col>
                    </Row>

                    <Row className="mt-5">
                      <Col lg="6">
                        <Figure>
                          <Figure.Image
                            width={480}
                            height={250}
                            alt="user clicked previous month"
                            src={theme === 'dark' ? img1 : img3}
                          />
                          <Figure.Caption>User clicked previous month.</Figure.Caption>
                        </Figure>
                      </Col>
                      <Col lg="6">
                        <Figure>
                          <Figure.Image
                            width={530}
                            height={250}
                            alt="user clicked next month"
                            src={theme === 'dark' ? img2 : img4}
                          />
                          <Figure.Caption>User clicked next month.</Figure.Caption>
                        </Figure>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey="code" title="Code">
                    <Row className="mt-5">
                      <CopyBlock
                        language="tsx"
                        showLineNumbers
                        theme={hybrid}
                        // customStyle={{ overflowX: 'scroll' }}
                        text={codeblocks.render2months}
                        codeBlock
                        // highlight="23-27,35-39"
                      />
                    </Row>
                  </Tab>
                </Tabs>
              </Container>
            </section>
            <section ref={transition_ref} data-section="transition">
              <h2 className="my-5">The transition:</h2>
              <Container>
                <Tabs
                  defaultActiveKey="description2"
                  id="render_2_months"
                  className="mb-3"
                  data-bs-theme={theme}
                >
                  <Tab eventKey="description2" title="Description">
                    <Row className="mt-5">
                      <Col lg="3">
                        <div className={styles[`datePickerPage__container`]}>
                          <DatePicker showLabel={false} speed={1000} demo={'transition'} />
                        </div>
                      </Col>
                      <Col lg="9">
                        <p>
                          At the time the user click next month{' '}
                          <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                            inProp
                          </Badge>{' '}
                          state is set to true. The entering phase is executed following by the
                          exiting phase. For our date picker we are only interested for one phase,
                          here I went for the exiting phase. That means the Transition component
                          have the callback onEntered to set the{' '}
                          <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                            inProp
                          </Badge>{' '}
                          state to false which will trigger the exiting phase thus our animation.{' '}
                          <br />
                          At the end of the animation the drop down show the next month but we still
                          have the initial month shown in the input and we still have the initial
                          month and the next month side by side. <br />
                        </p>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey="code2" title="Code">
                    <Row className="mt-5">
                      <Col>
                        <CopyBlock
                          language="tsx"
                          showLineNumbers
                          theme={hybrid}
                          customStyle={{ overflowX: 'scroll' }}
                          text={codeblocks.transition}
                          // highlight="27,40-42"
                        />
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </Container>
            </section>
            <section ref={render_selected} data-section="render_selected">
              <h2 className="my-5">Render the new selected month:</h2>
              <Container>
                <Row>
                  <Col lg="3">
                    <div className={styles[`datePickerPage__container`]}>
                      <DatePicker
                        showLabel={false}
                        speed={1000}
                        demo={'renderNewMonth'}
                        demoWithNoKey={true}
                      />
                    </div>
                  </Col>
                  <Col lg="9">
                    <p>
                      We can now trigger{' '}
                      <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                        time
                      </Badge>{' '}
                      state update with the new time, this will rerender DatePicker component and
                      update the input with only one month showing in the dropdown because{' '}
                      <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                        activeTransition
                      </Badge>{' '}
                      was set to false at the same time. <br />
                      Oh it seems we have an issue here. We supposed to have the animation ending at
                      the time DatePicker component is rendered with the new month. It looks like
                      that the Transition container which have the css animation applied translate
                      from half a month card length.
                      <br />
                    </p>
                    All phases :
                    <ol>
                      <li>
                        <p>
                          User click left/right arrow, the animation kick off. The transition
                          contanier show 2 months so translate +/-50% will move 1 month card length.
                        </p>
                      </li>
                      <li>
                        <p>
                          The animation is ending with the new month card visible, triggering a{' '}
                          <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                            time
                          </Badge>{' '}
                          state update{' '}
                        </p>
                      </li>
                      <li>
                        <p>DatePicker component rerender with the new month card selected</p>
                      </li>
                      <li>
                        <p>DatePicker show the new month card with -/+50% offset.</p>
                      </li>
                    </ol>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg="3">
                    <div className={styles[`datePickerPage__container`]}>
                      <DatePicker
                        showLabel={false}
                        speed={1000}
                        demo={'renderNewMonth'}
                        demoWithNoKey={false}
                      />
                    </div>
                  </Col>
                  <Col lg="9">
                    <p>
                      React rerender the DatePicker component following{' '}
                      <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                        time
                      </Badge>{' '}
                      state update. While this component should rerender all its children we can
                      assume that the Transition container hasn&apos;t changed at all, so during the
                      reconciliation phase React doesn&apos;t unmount this DOM node. Because of this
                      the css transition is still the same and we can see it translating back to its
                      initial position. To fix this we need to tell React to unmount Transition
                      container when a new time is set. We can simply add a key tag to the
                      transition container with the value of{' '}
                      <Badge bg={theme === 'dark' ? 'secondary' : 'light'} className="fs-7">
                        time
                      </Badge>{' '}
                      state. That way each time we set a new time the transition container is
                      unmounted from the DOM and a new one is mounted. The final work is now to make
                      only month card length visible.
                    </p>
                  </Col>
                </Row>
              </Container>
            </section>
          </Container>
        </Col>
        <Col xxl={3} className="position-relative d-none d-xxl-block">
          <section className={styles[`datePickerPage__sidebar`]}>
            <ButtonGroup
              vertical
              className="d-flex justify-content-start align-content-start"
              data-bs-theme={theme}
            >
              <Button
                active={activeSection === 'overview'}
                className={sidebar_btn_classes('overview')}
                variant="link"
                onClick={(e) => {
                  handleScrollToRef(e, overview_ref);
                }}
              >
                Overview
              </Button>
              <Button
                active={activeSection === 'render_2_month'}
                className={sidebar_btn_classes('render_2_month')}
                variant="link"
                onClick={(e) => {
                  handleScrollToRef(e, render_2_month_ref);
                }}
              >
                Render current month, next or previous month
              </Button>
              <Button
                active={activeSection === 'transition'}
                className={sidebar_btn_classes('transition')}
                variant="link"
                onClick={(e) => {
                  handleScrollToRef(e, transition_ref);
                }}
              >
                The transition
              </Button>
              <Button
                active={activeSection === 'render_selected'}
                className={sidebar_btn_classes('render_selected')}
                variant="link"
                onClick={(e) => {
                  handleScrollToRef(e, render_selected);
                }}
              >
                Render the new selected month
              </Button>
            </ButtonGroup>
          </section>
        </Col>
      </Row>
    </Container>
  );
};
export default DatePickerPage;
