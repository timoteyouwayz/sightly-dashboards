import { useEffect, useState } from 'react';
import { Users, Heart, BookOpen, School, Briefcase, UserCheck, Lock, Trash2 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EDIT_PASSWORD = 'admin123';

const EditPortal = () => {
  const { milestones, getAvailableYears, getYearTermData, getYearTotals, setIsEditMode, deleteYear } = useMinistryData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');

  const availableYears = getAvailableYears();
  const yearNum = Number(selectedYear);
  const yearTerms = getYearTermData(yearNum);
  const yearTotals = getYearTotals(yearNum);

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
            Select a year and click on any number to edit it. Changes are applied instantly.
          </p>
        </div>

        {/* Year Tabs */}
        <Tabs value={selectedYear} onValueChange={setSelectedYear} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TabsList>
              {availableYears.map(year => (
                <TabsTrigger key={year} value={String(year)} className="px-6">
                  {year}
                </TabsTrigger>
              ))}
            </TabsList>
            <AddYearDialog />
            {availableYears.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const yearNum = Number(selectedYear);
                  if (confirm(`Delete all data for ${selectedYear}? This cannot be undone.`)) {
                    deleteYear(yearNum);
                    const remaining = availableYears.filter(y => y !== yearNum);
                    setSelectedYear(String(remaining[remaining.length - 1]));
                  }
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete {selectedYear}
              </Button>
            )}
          </div>

          {availableYears.map(year => {
            const terms = getYearTermData(year);
            const totals = getYearTotals(year);
            return (
              <TabsContent key={year} value={String(year)}>
                {/* Metric Key */}
                <div className="mb-8 animate-fade-in">
                  <MetricKey />
                </div>

                {/* Year Totals */}
                <section className="mb-8">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                    {year} Year-to-Date Totals
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard title="Reached" value={totals.reached} icon={Users} variant="primary" delay={0} />
                    <StatCard title="Born Again" value={totals.bornAgain} icon={Heart} variant="success" delay={50} />
                    <StatCard title="Discipled" value={totals.discipled} icon={BookOpen} variant="info" delay={100} />
                    <StatCard title="Baptized" value={totals.bornAgain} icon={UserCheck} variant="warning" delay={150} />
                    <StatCard title="In Ministry" value={totals.discipled} icon={Briefcase} variant="accent" delay={200} />
                    <StatCard title="Churches" value={totals.schools} icon={School} variant="accent" delay={250} />
                  </div>
                </section>

                {/* Term Tables */}
                <section className="mb-8">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                    Term Breakdown
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <TermTable data={terms.term1} delay={300} year={year} />
                    <TermTable data={terms.term2} delay={400} year={year} />
                    <TermTable data={terms.term3} delay={500} year={year} />
                  </div>
                </section>

                {/* Milestones (only for current year) */}
                {year === 2025 && (
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
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Year Comparison (global) */}
        <section className="mb-8">
          <YearComparisonChart />
        </section>
      </div>
    </div>
  );
};

export default EditPortal;
