import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const NavbarWrapper = () => {
  return (
    <>
      <Navbar />
      <main style={{ marginTop: '5.4rem', marginBottom: '1.8rem' }}>
        <Outlet />
      </main>
    </>
  );
};
