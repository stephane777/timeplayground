import { FC } from 'react';
import MainNavbar from '../MainNavbar/MainNavbar';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../../utils/errorBoundaries';

const Layout: FC = () => {
  return (
    <ErrorBoundary>
      <header>
        <MainNavbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="my-5">Footer</footer>
    </ErrorBoundary>
  );
};

export { Layout };
