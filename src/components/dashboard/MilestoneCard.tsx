import { Milestone } from '@/data/ministryData';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { EditableCell } from './EditableCell';
import { Target } from 'lucide-react';

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
  delay?: number;
}

export const MilestoneCard = ({ milestone, index, delay = 0 }: MilestoneCardProps) => {
  const { isEditMode, updateMilestone } = useMinistryData();
  const percentage = Math.min((milestone.current / milestone.target) * 100, 100);
  const isComplete = milestone.current >= milestone.target;

  return (
    <div 
      className="card-elevated p-6 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${isComplete ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{milestone.label}</h3>
          <p className="text-sm text-muted-foreground">
            Road to:{' '}
            {isEditMode ? (
              <EditableCell 
                value={milestone.target} 
                onSave={(v) => updateMilestone(index, 'target', v)}
                className="font-bold text-accent"
              />
            ) : (
              <span className="font-bold text-accent">{milestone.target.toLocaleString()}</span>
            )}
          </p>
        </div>
      </div>

      <div className="progress-bar mb-3">
        <div 
          className={`progress-fill ${isComplete ? 'progress-fill-accent' : ''}`}
          style={{ width: `${percentage}%`, transitionDelay: `${delay + 200}ms` }}
        />
      </div>

      <div className="flex justify-between items-center">
        {isEditMode ? (
          <EditableCell 
            value={milestone.current} 
            onSave={(v) => updateMilestone(index, 'current', v)}
            className="text-2xl font-bold font-display text-foreground"
          />
        ) : (
          <span className="text-2xl font-bold font-display text-foreground">
            {milestone.current.toLocaleString()}
          </span>
        )}
        <span className={`metric-badge ${isComplete ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>

      {isComplete && (
        <div className="mt-3 p-2 bg-success/10 rounded-lg text-center">
          <span className="text-sm font-medium text-success">🎉 Target Achieved!</span>
        </div>
      )}
    </div>
  );
};
