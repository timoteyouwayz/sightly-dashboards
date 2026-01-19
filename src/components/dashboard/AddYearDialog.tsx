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

export const AddYearDialog = () => {
  const { addYearComparison, yearComparisons, isEditMode } = useMinistryData();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [reached, setReached] = useState('0');
  const [bornAgain, setBornAgain] = useState('0');
  const [discipled, setDiscipled] = useState('0');
  const [schools, setSchools] = useState('0');
  const [counties, setCounties] = useState('0');
  const [partnersTrained, setPartnersTrained] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yearNum = parseInt(year);
    
    if (yearComparisons.some(y => y.year === yearNum)) {
      alert('This year already exists!');
      return;
    }

    addYearComparison({
      year: yearNum,
      reached: parseInt(reached) || 0,
      bornAgain: parseInt(bornAgain) || 0,
      discipled: parseInt(discipled) || 0,
      schools: parseInt(schools) || 0,
      counties: parseInt(counties) || 0,
      partnersTrained: parseInt(partnersTrained) || 0,
    });

    setYear((new Date().getFullYear() + 1).toString());
    setReached('0');
    setBornAgain('0');
    setDiscipled('0');
    setSchools('0');
    setCounties('0');
    setPartnersTrained('0');
    setOpen(false);
  };

  if (!isEditMode) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Year
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Year Data</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2000"
              max="2100"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reached">Reached</Label>
              <Input
                id="reached"
                type="number"
                value={reached}
                onChange={(e) => setReached(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bornAgain">Born Again</Label>
              <Input
                id="bornAgain"
                type="number"
                value={bornAgain}
                onChange={(e) => setBornAgain(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="discipled">Discipled</Label>
              <Input
                id="discipled"
                type="number"
                value={discipled}
                onChange={(e) => setDiscipled(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="schools">Schools</Label>
              <Input
                id="schools"
                type="number"
                value={schools}
                onChange={(e) => setSchools(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="counties">Counties</Label>
              <Input
                id="counties"
                type="number"
                value={counties}
                onChange={(e) => setCounties(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partnersTrained">Partners Trained</Label>
              <Input
                id="partnersTrained"
                type="number"
                value={partnersTrained}
                onChange={(e) => setPartnersTrained(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Add Year</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
