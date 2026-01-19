import { Calendar, BarChart3 } from 'lucide-react';
import { EditModeToggle } from './EditModeToggle';
import { useMinistryData } from '@/contexts/MinistryDataContext';

export const DashboardHeader = () => {
  const { isEditMode } = useMinistryData();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              YFC Kenya Ministry
            </h1>
            <p className="text-muted-foreground">Tracking Board Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <EditModeToggle />
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{currentDate}</span>
          </div>
        </div>
      </div>
      {isEditMode && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary">
            <strong>Edit Mode:</strong> Click on any number in the tables or milestones to edit it. Changes auto-save when you click away or press Enter.
          </p>
        </div>
      )}
    </header>
  );
};
