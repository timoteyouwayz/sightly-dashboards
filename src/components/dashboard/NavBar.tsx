import { Link } from 'react-router-dom';
import { Menu, BarChart3, GitCompare } from 'lucide-react';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const fixedLinks = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/compare', label: 'Compare', icon: GitCompare },
];

export const NavBar = () => {
  const { getAvailableYears } = useMinistryData();
  const years = getAvailableYears();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {fixedLinks.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </Link>
      ))}
      {years.map((year) => (
        <Link
          key={year}
          to={`/year/${year}`}
          onClick={onNavigate}
          className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          {year}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <a href="#hero" className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-xl bg-primary text-primary-foreground">
              Y
            </div>
            <span className="font-display font-bold text-base md:text-lg text-foreground">YFC Kenya</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            <NavLinks />
          </div>

          <div className="flex md:hidden items-center gap-2">
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
