import { useEffect, useState } from 'react';
import { Users, Heart, BookOpen, School, Briefcase, UserCheck, Lock } from 'lucide-react';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { MetricKey } from '@/components/dashboard/MetricKey';
import { StatCard } from '@/components/dashboard/StatCard';
import { MilestoneCard } from '@/components/dashboard/MilestoneCard';
import { TermTable } from '@/components/dashboard/TermTable';
import { YearComparisonChart } from '@/components/dashboard/YearComparisonChart';
import { AddMilestoneDialog } from '@/components/dashboard/AddMilestoneDialog';
import { AddYearDialog } from '@/components/dashboard/AddYearDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const EDIT_PASSWORD = 'admin123';

const EditPortal = () => {
  const { term1Data, term2Data, term3Data, milestones, getGrandTotals, setIsEditMode } = useMinistryData();
  const grandTotals = getGrandTotals();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setIsEditMode(true);
      return () => setIsEditMode(false);
    }
  }, [isAuthenticated, setIsEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === EDIT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display">Edit Portal</CardTitle>
            <CardDescription>Enter the password to access the editing interface.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">Unlock</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-display font-bold text-foreground">Edit Portal</h2>
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              Edit Mode Active
            </span>
          </div>
          <p className="text-muted-foreground">
            Click on any number to edit it. Changes are applied instantly.
          </p>
        </div>

        {/* Metric Key */}
        <div className="mb-8 animate-fade-in">
          <MetricKey />
        </div>

        {/* Grand Totals Stats */}
        <section className="mb-8">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            2025 Year-to-Date Totals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Reached" value={grandTotals.reached} icon={Users} variant="primary" delay={0} />
            <StatCard title="Born Again" value={grandTotals.bornAgain} icon={Heart} variant="success" delay={50} />
            <StatCard title="Discipled" value={grandTotals.discipled} icon={BookOpen} variant="info" delay={100} />
            <StatCard title="Baptized" value={grandTotals.bornAgain} icon={UserCheck} variant="warning" delay={150} />
            <StatCard title="In Ministry" value={grandTotals.discipled} icon={Briefcase} variant="accent" delay={200} />
            <StatCard title="Churches" value={grandTotals.schools} icon={School} variant="accent" delay={250} />
          </div>
        </section>

        {/* Term Tables */}
        <section className="mb-8">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            Term Breakdown
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TermTable data={term1Data} delay={300} />
            <TermTable data={term2Data} delay={400} />
            <TermTable data={term3Data} delay={500} />
          </div>
        </section>

        {/* Milestones */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-foreground">Key Milestones</h2>
            <AddMilestoneDialog />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={index} milestone={milestone} index={index} delay={600 + index * 100} />
            ))}
          </div>
        </section>

        {/* Year Comparison */}
        <section className="mb-8">
          <YearComparisonChart />
        </section>
      </div>
    </div>
  );
};

export default EditPortal;
