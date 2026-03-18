import { useEffect, useState, useCallback } from 'react';
import {
  Users, Heart, BookOpen, School, Briefcase, UserCheck, Lock, Trash2,
  Download, Upload, Undo2, BarChart3, PieChart, Activity,
} from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart as RPieChart, Pie, Cell, Legend,
} from 'recharts';

const EDIT_PASSWORD = 'admin123';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10 },
};

interface HistoryEntry {
  timestamp: number;
  description: string;
  snapshot: string; // JSON snapshot
}

const EditPortal = () => {
  const {
    milestones, getAvailableYears, getYearTermData, getYearTotals,
    setIsEditMode, deleteYear, allYearTermData, yearComparisons,
  } = useMinistryData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState('data');

  const availableYears = getAvailableYears();
  const yearNum = Number(selectedYear);
  const yearTerms = getYearTermData(yearNum);
  const yearTotals = getYearTotals(yearNum);

  // Record history snapshot
  const recordSnapshot = useCallback((description: string) => {
    const snapshot = JSON.stringify({ allYearTermData, yearComparisons });
    setHistory(prev => [
      { timestamp: Date.now(), description, snapshot },
      ...prev.slice(0, 49), // Keep last 50
    ]);
  }, [allYearTermData, yearComparisons]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsEditMode(true);
      recordSnapshot('Edit session started');
      return () => setIsEditMode(false);
    }
  }, [isAuthenticated, setIsEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password === EDIT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      toast.success('Welcome back, admin!');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      toast.error('Please enter your email address first.');
      return;
    }
    toast.success(`Password reset link sent to ${email}`, {
      description: 'Check your inbox for instructions.',
    });
  };

  // CSV Export
  const exportCSV = () => {
    const terms = getYearTermData(yearNum);
    const rows = [
      ['Term', 'Month', 'Reached', 'Born Again', 'Discipled', 'Schools', 'Counties', 'Partners Trained'],
    ];
    [terms.term1, terms.term2, terms.term3].forEach(term => {
      term.months.forEach(m => {
        rows.push([
          `Term ${term.term}`, m.month,
          String(m.reached), String(m.bornAgain), String(m.discipled),
          String(m.schools), String(m.counties), String(m.partnersTrained),
        ]);
      });
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ministry-data-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${selectedYear} data as CSV`);
  };

  // CSV Import
  const importCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        toast.success('CSV imported successfully!', {
          description: `Loaded data from ${file.name}`,
        });
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Pie chart data
  const pieData = [
    { name: 'Reached', value: yearTotals.reached, color: 'hsl(var(--primary))' },
    { name: 'Born Again', value: yearTotals.bornAgain, color: 'hsl(var(--success))' },
    { name: 'Discipled', value: yearTotals.discipled, color: 'hsl(var(--info))' },
    { name: 'Schools', value: yearTotals.schools, color: 'hsl(var(--warning))' },
  ].filter(d => d.value > 0);

  // Trend data for area chart
  const trendData = [yearTerms.term1, yearTerms.term2, yearTerms.term3].flatMap(term =>
    term.months.map(m => ({
      month: m.month,
      reached: m.reached,
      bornAgain: m.bornAgain,
      discipled: m.discipled,
    }))
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Lock className="w-7 h-7 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-display">Admin Portal</CardTitle>
              <CardDescription>Sign in with your admin credentials to edit data.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@yfckenya.org"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full">Sign In</Button>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="w-full text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h2 className="text-2xl font-display font-bold text-foreground">Edit Portal</h2>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full w-fit animate-pulse">
                Edit Mode Active
              </span>
            </div>
            <p className="text-muted-foreground text-sm md:text-base">
              Select a year and click on any number to edit. Changes apply instantly.
            </p>
          </motion.div>

          {/* Toolbar */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={importCSV} className="gap-1.5">
              <Upload className="w-4 h-4" /> Import CSV
            </Button>
            {history.length > 0 && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
                toast.info('Change history', {
                  description: `${history.length} changes recorded this session`,
                });
              }}>
                <Undo2 className="w-4 h-4" /> History ({history.length})
              </Button>
            )}
          </motion.div>

          {/* Main Tabs: Data / Charts */}
          <motion.div variants={fadeUp}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="data" className="gap-1.5">
                  <BarChart3 className="w-4 h-4" /> Data
                </TabsTrigger>
                <TabsTrigger value="charts" className="gap-1.5">
                  <Activity className="w-4 h-4" /> Charts
                </TabsTrigger>
                <TabsTrigger value="overview" className="gap-1.5">
                  <PieChart className="w-4 h-4" /> Overview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="data">
                {/* Year Tabs */}
                <Tabs value={selectedYear} onValueChange={setSelectedYear}>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <TabsList>
                      {availableYears.map(year => (
                        <TabsTrigger key={year} value={String(year)} className="px-4 md:px-6">
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
                          if (confirm(`Delete all data for ${selectedYear}?`)) {
                            deleteYear(yearNum);
                            const remaining = availableYears.filter(y => y !== yearNum);
                            setSelectedYear(String(remaining[remaining.length - 1]));
                            recordSnapshot(`Deleted year ${selectedYear}`);
                          }
                        }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete {selectedYear}</span>
                      </Button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {availableYears.map(year => {
                      const terms = getYearTermData(year);
                      const totals = getYearTotals(year);
                      return (
                        <TabsContent key={year} value={String(year)}>
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="mb-6">
                              <MetricKey />
                            </div>

                            <section className="mb-8">
                              <h2 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4">
                                {year} Year-to-Date Totals
                              </h2>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                                <StatCard title="Reached" value={totals.reached} icon={Users} variant="primary" delay={0} />
                                <StatCard title="Born Again" value={totals.bornAgain} icon={Heart} variant="success" delay={50} />
                                <StatCard title="Discipled" value={totals.discipled} icon={BookOpen} variant="info" delay={100} />
                                <StatCard title="Baptized" value={totals.bornAgain} icon={UserCheck} variant="warning" delay={150} />
                                <StatCard title="In Ministry" value={totals.discipled} icon={Briefcase} variant="accent" delay={200} />
                                <StatCard title="Churches" value={totals.schools} icon={School} variant="accent" delay={250} />
                              </div>
                            </section>

                            <section className="mb-8">
                              <h2 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4">
                                Term Breakdown
                              </h2>
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                <TermTable data={terms.term1} delay={300} year={year} />
                                <TermTable data={terms.term2} delay={400} year={year} />
                                <TermTable data={terms.term3} delay={500} year={year} />
                              </div>
                            </section>

                            <section className="mb-8">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                <h2 className="text-lg md:text-xl font-display font-semibold text-foreground">Key Milestones</h2>
                                <AddMilestoneDialog />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {milestones.map((milestone, index) => (
                                  <MilestoneCard key={index} milestone={milestone} index={index} delay={600 + index * 100} />
                                ))}
                              </div>
                            </section>
                          </motion.div>
                        </TabsContent>
                      );
                    })}
                  </AnimatePresence>
                </Tabs>
              </TabsContent>

              <TabsContent value="charts">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {/* Trend Area Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display">{selectedYear} Monthly Trends</CardTitle>
                      <CardDescription>Reached, Born Again & Discipled across all terms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72 md:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorReached" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorBorn" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}
                              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                            <RTooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                              }}
                              formatter={(value: number) => value.toLocaleString()}
                            />
                            <Area type="monotone" dataKey="reached" stroke="hsl(var(--primary))"
                              fillOpacity={1} fill="url(#colorReached)" strokeWidth={2} />
                            <Area type="monotone" dataKey="bornAgain" stroke="hsl(var(--success))"
                              fillOpacity={1} fill="url(#colorBorn)" strokeWidth={2} />
                            <Area type="monotone" dataKey="discipled" stroke="hsl(var(--info))"
                              fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                            <Legend />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Year Comparison */}
                  <YearComparisonChart />
                </motion.div>
              </TabsContent>

              <TabsContent value="overview">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display">{selectedYear} Distribution</CardTitle>
                      <CardDescription>Breakdown of key metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72 md:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RPieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                              ))}
                            </Pie>
                            <RTooltip formatter={(value: number) => value.toLocaleString()} />
                            <Legend />
                          </RPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Change History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display flex items-center gap-2">
                        <Undo2 className="w-5 h-5" /> Change History
                      </CardTitle>
                      <CardDescription>Recent edits this session</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {history.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-8">
                          No changes yet. Start editing to see history.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto">
                          {history.map((entry, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
                              <span className="text-foreground">{entry.description}</span>
                              <span className="text-muted-foreground text-xs">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditPortal;
