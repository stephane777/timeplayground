import { FC } from 'react';
import MainNavbar from '../MainNavbar/MainNavbar';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../../utils/errorBoundaries';
import Footer from '../Footer/Footer';

const Layout: FC = () => {
  return (
    <ErrorBoundary>
      <header>
        <MainNavbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </ErrorBoundary>
  );
};

export { Layout };
