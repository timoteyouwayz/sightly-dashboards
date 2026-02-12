import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <Outlet />
    </div>
  );
};
