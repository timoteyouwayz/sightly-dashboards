import { LucideIcon } from 'lucide-react';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { EditableCell } from './EditableCell';
import { useCountUp } from '@/hooks/useCountUp';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'info' | 'warning' | 'accent';
  delay?: number;
  field?: string;
}

export const StatCard = ({ title, value, icon: Icon, variant = 'primary', delay = 0, field }: StatCardProps) => {
  const { isEditMode } = useMinistryData();
  const animatedValue = useCountUp(value, 1200);

  return (
    <div
      className="stat-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}>
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1 text-center">{title}</p>
          {isEditMode && field ?
          <div className="text-3xl font-bold font-display text-foreground">
              <EditableCell
              value={value}
              onSave={() => {}}
              className="text-3xl font-bold" />
            </div> :
          <p className="text-3xl font-bold font-display text-foreground text-center">
              {animatedValue.toLocaleString()}
            </p>
          }
        </div>
      </div>
    </div>);
};
