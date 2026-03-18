import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const AdminFloatingButton = () => {
  const location = useLocation();
  const isActive = location.pathname === '/edit';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to="/edit"
          className={cn(
            'fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300',
            'hover:scale-110 hover:shadow-xl',
            isActive
              ? 'bg-primary text-primary-foreground shadow-primary/30'
              : 'bg-card text-muted-foreground border border-border hover:text-primary hover:border-primary/30'
          )}
        >
          <Shield className="w-5 h-5" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Admin Edit Portal</p>
      </TooltipContent>
    </Tooltip>
  );
};
