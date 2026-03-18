import { Link, useLocation } from 'react-router-dom';
import { BarChart3, GitCompare, Calendar, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/compare', label: 'Compare', icon: GitCompare },
];

export const NavBar = () => {
  const location = useLocation();
  const { getAvailableYears } = useMinistryData();
  const years = getAvailableYears();
  const [open, setOpen] = useState(false);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive(item.to)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </Link>
      ))}
      {years.map((year) => (
        <Link
          key={year}
          to={`/year/${year}`}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            location.pathname === `/year/${year}`
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{year}</span>
        </Link>
      ))}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-xl bg-primary text-primary-foreground">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="font-display font-bold text-base md:text-lg text-foreground">
              YFC Kenya
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLinks />
            <div className="ml-2 pl-2 border-l border-border">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-4">
                <SheetTitle className="font-display text-lg mb-4">Navigation</SheetTitle>
                <div className="flex flex-col gap-1">
                  <NavLinks onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
