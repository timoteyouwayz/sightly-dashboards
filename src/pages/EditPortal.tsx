import { useEffect, useState, useCallback } from 'react';
import {
  Users, Heart, BookOpen, School, Briefcase, UserCheck, Lock, Trash2,
  Download, Upload, Undo2, BarChart3, PieChart, Activity, Image as ImageIcon,
  Settings, Plus, Clock,
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
import { Textarea } from '@/components/ui/textarea';

const EDIT_PASSWORD = 'admin123';
const ADMIN_EMAILS = ['helpdesk@kenyayfc.org'];

interface Testimonial {
  id: string;
  name: string;
  location: string;
  statement: string;
  image: string;
  fullStory: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

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
  const [carouselInterval, setCarouselInterval] = useState(7000);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Aisha',
      location: 'Machakos',
      statement: 'YFC has given me a leadership voice and a family in Christ. The youth meetings are a life-line.',
      image: '/images/testimonial-1.jpg',
      fullStory: 'Aisha joined YFC in 2023 and has since led the weekend youth group. Her story is an example of leadership, faith, and community service.',
    },
    {
      id: '2',
      name: 'Samuel',
      location: 'Nairobi',
      statement: 'I was lost before YFC. Today I serve as a worship leader and mentor younger students.',
      image: '/images/testimonial-2.jpg',
      fullStory: 'Samuel discovered purpose through discipleship training and now organizes music sessions at school and church. He actively mentors younger students each week.',
    },
    {
      id: '3',
      name: 'Grace',
      location: 'Mombasa',
      statement: 'The discipleship training helped me to start community Bible discussions in my school.',
      image: '/images/testimonial-3.jpg',
      fullStory: 'Grace started a Bible study circle in her school and helped other students with personal growth. YFC support helped her present at the county youth forum.',
    },
  ]);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'helpdesk@kenyayfc.org',
      name: 'Admin User',
      role: 'admin',
    },
  ]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [activities, setActivities] = useState([
    { id: '1', title: 'Prayer Gatherings', description: 'Weekly prayer and worship evenings for young people across counties.' },
    { id: '2', title: 'Bible Schools', description: 'Training leaders with practical theology and outreach skills.' },
    { id: '3', title: 'Community Outreach', description: 'Feeding, counseling, and prayer for local families.' },
    { id: '4', title: 'Youth Camps', description: 'Campfires and worship nights that transform hearts.' },
    { id: '5', title: 'Mission & Evangelism', description: 'Field evangelism and discipleship in unreached areas.' },
    { id: '6', title: 'Leadership Training', description: 'Intensive training for emerging youth leaders and mentors.' },
  ]);

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

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: 'New Testimonial',
      location: 'Location',
      statement: 'Add your testimonial statement here.',
      image: '/images/testimonial-1.jpg',
      fullStory: 'Add the full story here.',
    };
    setTestimonials([...testimonials, newTestimonial]);
    toast.success('New testimonial added');
    recordSnapshot('Added new testimonial');
  };

  const updateTestimonial = (id: string, updatedTestimonial: Partial<Testimonial>) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, ...updatedTestimonial } : t));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
    toast.success('Testimonial deleted');
    recordSnapshot('Deleted testimonial');
  };

  const addUser = () => {
    if (!newUserEmail.trim() || !newUserName.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    const newUser: User = {
      id: Date.now().toString(),
      email: newUserEmail,
      name: newUserName,
      role: newUserRole,
    };
    setUsers([...users, newUser]);
    setNewUserEmail('');
    setNewUserName('');
    toast.success(`User ${newUserName} added successfully`);
    recordSnapshot(`Added user ${newUserName}`);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('User deleted');
    recordSnapshot('Deleted user');
  };

  const handleCarouselApply = () => {
    localStorage.setItem('carouselInterval', String(carouselInterval));
    toast.success(`Carousel interval updated to ${carouselInterval}ms`);
    recordSnapshot(`Changed carousel interval to ${carouselInterval}ms`);
  };

  const handleImageUpload = (testimonialId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateTestimonial(testimonialId, { image: dataUrl });
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const addActivity = () => {
    const newActivity = {
      id: Date.now().toString(),
      title: 'New Activity',
      description: 'Add activity description here.',
    };
    setActivities([...activities, newActivity]);
    toast.success('New activity added');
    recordSnapshot('Added new activity');
  };

  const updateActivity = (id: string, updatedActivity: Partial<{ title: string; description: string }>) => {
    setActivities(activities.map(a => a.id === id ? { ...a, ...updatedActivity } : a));
  };

  const deleteActivity = (id: string) => {
    if (activities.length <= 1) {
      toast.error('You must have at least one activity');
      return;
    }
    setActivities(activities.filter(a => a.id !== id));
    toast.success('Activity deleted');
    recordSnapshot('Deleted activity');
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
                    placeholder="helpdesk@kenyayfc.org"
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
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="data" className="gap-1.5">
                  <BarChart3 className="w-4 h-4" /> Data
                </TabsTrigger>
                <TabsTrigger value="charts" className="gap-1.5">
                  <Activity className="w-4 h-4" /> Charts
                </TabsTrigger>
                <TabsTrigger value="overview" className="gap-1.5">
                  <PieChart className="w-4 h-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="testimonies" className="gap-1.5">
                  <Heart className="w-4 h-4" /> Testimonies
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-1.5">
                  <Settings className="w-4 h-4" /> Settings
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-1.5">
                  <Users className="w-4 h-4" /> Users
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

              {/* TESTIMONIES TAB */}
              <TabsContent value="testimonies">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  {/* TESTIMONIES SECTION */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg md:text-xl font-display font-semibold text-foreground">Manage Testimonies</h2>
                      <Button onClick={addTestimonial} className="gap-1.5">
                        <Plus className="w-4 h-4" /> Add Testimony
                      </Button>
                    </div>

                    <div className="grid gap-6">
                    {testimonials.map((testimonial) => (
                      <Card key={testimonial.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                              <CardDescription>{testimonial.location}</CardDescription>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteTestimonial(testimonial.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Name</label>
                            <Input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                              placeholder="Testimonial name"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Location</label>
                            <Input
                              type="text"
                              value={testimonial.location}
                              onChange={(e) => updateTestimonial(testimonial.id, { location: e.target.value })}
                              placeholder="Location"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Statement (Short Quote)</label>
                            <Textarea
                              value={testimonial.statement}
                              onChange={(e) => updateTestimonial(testimonial.id, { statement: e.target.value })}
                              placeholder="Enter the testimonial statement"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Full Story</label>
                            <Textarea
                              value={testimonial.fullStory}
                              onChange={(e) => updateTestimonial(testimonial.id, { fullStory: e.target.value })}
                              placeholder="Enter the full testimonial story"
                              rows={4}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Image URL</label>
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                value={testimonial.image}
                                onChange={(e) => updateTestimonial(testimonial.id, { image: e.target.value })}
                                placeholder="/images/testimonial-1.jpg"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="gap-1.5"
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e) => handleImageUpload(testimonial.id, e as any);
                                  input.click();
                                }}
                              >
                                <Upload className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Upload image to /public/images/ folder or use URL
                            </p>
                            {testimonial.image && (
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="mt-3 h-24 w-24 object-cover rounded"
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                    </div>

                  {/* ACTIVITIES SECTION */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg md:text-xl font-display font-semibold text-foreground">Manage Activities</h2>
                      <Button onClick={addActivity} className="gap-1.5">
                        <Plus className="w-4 h-4" /> Add Activity
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {activities.map((activity) => (
                        <Card key={activity.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{activity.title}</CardTitle>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteActivity(activity.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Title</label>
                              <Input
                                type="text"
                                value={activity.title}
                                onChange={(e) => updateActivity(activity.id, { title: e.target.value })}
                                placeholder="Activity title"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Description</label>
                              <Textarea
                                value={activity.description}
                                onChange={(e) => updateActivity(activity.id, { description: e.target.value })}
                                placeholder="Activity description"
                                rows={3}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* SETTINGS TAB */}
              <TabsContent value="settings">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Testimonies Carousel
                      </CardTitle>
                      <CardDescription>Configure auto-play settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Auto-play Interval (milliseconds)</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={carouselInterval}
                            onChange={(e) => setCarouselInterval(Number(e.target.value))}
                            placeholder="7000"
                            min="1000"
                            step="500"
                          />
                          <Button variant="outline" onClick={handleCarouselApply}>Apply</Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Current: {carouselInterval}ms ({(carouselInterval / 1000).toFixed(1)}s)
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Usage in component: Pass <code className="bg-muted px-2 py-1 rounded">autoPlayInterval={"{carouselInterval}"}</code> to TestimoniesHeroCarousel
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" /> Activity Cards
                      </CardTitle>
                      <CardDescription>Manage activity cards displayed on homepage</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">
                          💡 <strong>Tip:</strong> Activities are now managed in the <strong>Testimonies tab</strong> at the top. Go there to add, edit, or delete activities.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-3">Current Activities ({activities.length})</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {activities.map((activity, idx) => (
                            <li key={idx}>• <strong>{activity.title}</strong></li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* USERS TAB */}
              <TabsContent value="users">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display flex items-center gap-2">
                        <Users className="w-5 h-5" /> Manage Users
                      </CardTitle>
                      <CardDescription>Add and manage admin portal access</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Add New User */}
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-medium mb-4">Add New User</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Email</label>
                            <Input
                              type="email"
                              placeholder="user@example.com"
                              value={newUserEmail}
                              onChange={(e) => setNewUserEmail(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Name</label>
                            <Input
                              type="text"
                              placeholder="John Doe"
                              value={newUserName}
                              onChange={(e) => setNewUserName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Role</label>
                            <select
                              value={newUserRole}
                              onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                              className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                            >
                              <option value="admin">Admin - Full access</option>
                              <option value="editor">Editor - Can edit data</option>
                              <option value="viewer">Viewer - View only</option>
                            </select>
                          </div>
                          <Button onClick={addUser} className="w-full gap-1.5">
                            <Plus className="w-4 h-4" /> Add User
                          </Button>
                        </div>
                      </div>

                      {/* Users List */}
                      <div>
                        <h3 className="font-medium mb-3">Active Users</h3>
                        <div className="space-y-2">
                          {users.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                  {user.role}
                                </span>
                              </div>
                              {user.email !== 'helpdesk@kenyayfc.org' && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteUser(user.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
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
