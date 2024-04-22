import React, { FC } from 'react';
import MainNavbar from '../MainNavbar/MainNavbar';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

const Layout: FC = () => {
  return (
    <>
      <header>
        <MainNavbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="my-5">Footer</footer>
    </>
  );
};

export { Layout };
