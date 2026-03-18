import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { AnimatedBackground } from './AnimatedBackground';
import { AdminFloatingButton } from './AdminFloatingButton';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <NavBar />
      <div className="relative z-10">
        <Outlet />
      </div>
      <AdminFloatingButton />
    </div>
  );
};
