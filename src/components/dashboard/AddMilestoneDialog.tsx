import { useState } from 'react';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AddMilestoneDialog = () => {
  const { addMilestone, isEditMode } = useMinistryData();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [current, setCurrent] = useState('0');
  const [target, setTarget] = useState('1000');
  const [unit, setUnit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    addMilestone({
      label: label.trim(),
      current: parseInt(current) || 0,
      target: parseInt(target) || 1000,
      unit: unit.trim() || label.toLowerCase(),
    });

    setLabel('');
    setCurrent('0');
    setTarget('1000');
    setUnit('');
    setOpen(false);
  };

  if (!isEditMode) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Milestone
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Milestone</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="label">Milestone Name</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Churches"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current">Current Value</Label>
              <Input
                id="current"
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="unit">Unit (optional)</Label>
            <Input
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., churches"
            />
          </div>
          <Button type="submit" className="w-full">Add Milestone</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
