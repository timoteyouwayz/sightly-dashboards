import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { EditableCell } from './EditableCell';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'info' | 'warning' | 'accent';
  delay?: number;
  field?: string;
}

const variantStyles = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
  accent: 'bg-accent/10 text-accent',
};

export const StatCard = ({ title, value, icon: Icon, variant = 'primary', delay = 0, field }: StatCardProps) => {
  const { isEditMode } = useMinistryData();

  return (
    <div 
      className="stat-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          {isEditMode && field ? (
            <div className="text-3xl font-bold font-display text-foreground">
              <EditableCell 
                value={value} 
                onSave={() => {}} 
                className="text-3xl font-bold"
              />
            </div>
          ) : (
            <p className="text-3xl font-bold font-display text-foreground animate-count-up">
              {value.toLocaleString()}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', variantStyles[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
