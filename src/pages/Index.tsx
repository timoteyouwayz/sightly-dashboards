import React, { useState, useEffect } from 'react';
import { Users, Heart, BookOpen, School, MapPin, UserCheck, Globe, Briefcase, DollarSign, Film, MessageSquare, Clock, Check, Calendar, X, Download, XCircle, Trash2, Plus, Mail, Phone, Home, FileText, Building, Menu, LogOut, Lock } from 'lucide-react';
import { MinistryDataProvider, useMinistryData } from '@/contexts/MinistryDataContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricKey } from '@/components/dashboard/MetricKey';
import { StatCard } from '@/components/dashboard/StatCard';
import { MilestoneCard } from '@/components/dashboard/MilestoneCard';
import { TermTable } from '@/components/dashboard/TermTable';
import { YearComparisonChart } from '@/components/dashboard/YearComparisonChart';
import { AddMilestoneDialog } from '@/components/dashboard/AddMilestoneDialog';
import { useEditShortcut } from '@/hooks/useEditShortcut';

const MinistryDashboardContent = ({ onSwitchSystem }) => {
  const { term1Data, term2Data, term3Data, milestones, getGrandTotals } = useMinistryData();
  useEditShortcut();
  const grandTotals = getGrandTotals();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <DashboardHeader />
          <button
            onClick={() => onSwitchSystem(null)}
            className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-2 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg flex items-center space-x-2"
          >
            <Globe size={18} />
            <span>Switch System</span>
          </button>
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
            <StatCard
              title="Reached"
              value={grandTotals.reached}
              icon={Users}
              variant="primary"
              delay={0}
            />
            <StatCard
              title="Born Again"
              value={grandTotals.bornAgain}
              icon={Heart}
              variant="success"
              delay={50}
            />
            <StatCard
              title="Discipled"
              value={grandTotals.discipled}
              icon={BookOpen}
              variant="info"
              delay={100}
            />
            <StatCard
              title="Baptized"
              value={grandTotals.bornAgain}
              icon={UserCheck}
              variant="warning"
              delay={150}
            />
            <StatCard
              title="In Ministry"
              value={grandTotals.discipled}
              icon={Briefcase}
              variant="accent"
              delay={200}
            />
            <StatCard
              title="Churches"
              value={grandTotals.schools}
              icon={School}
              variant="accent"
              delay={250}
            />
          </div>
        </section>

        {/* Term Tables */}
        <section className="mb-8">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            Term Breakdown
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TermTable
              data={term1Data}
              delay={300}
            />
            <TermTable
              data={term2Data}
              delay={400}
            />
            <TermTable
              data={term3Data}
              delay={500}
            />
          </div>
        </section>

        {/* Milestones */}
        <section className="mb-8">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            Key Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <MilestoneCard
                key={index}
                milestone={milestone}
                index={index}
                delay={600 + index * 100}
              />
            ))}
          </div>
        </section>

        {/* Year Comparison Chart */}
        <section className="mb-8">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            Year-over-Year Comparison
          </h2>
          <YearComparisonChart />
        </section>

        {/* Add Milestone Dialog */}
        <AddMilestoneDialog />
      </div>
    </div>
  );
};

const MinistryDashboard = ({ onSwitchSystem }) => {
  return (
    <MinistryDataProvider>
      <MinistryDashboardContent onSwitchSystem={onSwitchSystem} />
    </MinistryDataProvider>
  );
};

const SystemSelector = ({ onSelectSystem }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Management Systems</h1>
          <p className="text-lg text-slate-600">Choose the system you want to access</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ministry Dashboard Card */}
          <div
            onClick={() => onSelectSystem('ministry')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-blue-300"
          >
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Ministry Dashboard</h3>
              <p className="text-slate-600">Track ministry metrics, milestones, and progress reports</p>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Real-time statistics and KPIs</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Term-by-term progress tracking</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Milestone management</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Year-over-year comparisons</span>
              </div>
            </div>
          </div>

          {/* KYFC Management System Card */}
          <div
            onClick={() => onSelectSystem('kyfc')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-teal-300"
          >
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full">
                <Globe className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">KYFC Management</h3>
              <p className="text-slate-600">Internal management system for Kenya Youth For Christ</p>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                <span>Request management (Money & Leave)</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                <span>Staff directory and departments</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                <span>Role-based access control</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                <span>Approval workflows</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            Select a system to continue. You can switch between systems anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [selectedSystem, setSelectedSystem] = useState(null);

  if (!selectedSystem) {
    return <SystemSelector onSelectSystem={setSelectedSystem} />;
  }

  if (selectedSystem === 'ministry') {
    return <MinistryDashboard onSwitchSystem={setSelectedSystem} />;
  }

  if (selectedSystem === 'kyfc') {
    return <KYFCSystem onSwitchSystem={setSelectedSystem} />;
  }

  return <SystemSelector onSelectSystem={setSelectedSystem} />;
};

const KYFCSystem = ({ onSwitchSystem }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(null);
  const [departments, setDepartments] = useState({
    accounts: { name: 'Accounts', icon: 'DollarSign', color: 'bg-emerald-700' },
    hr: { name: 'HR', icon: 'Users', color: 'bg-blue-800' },
    nationalDirector: { name: 'National Director', icon: 'Briefcase', color: 'bg-slate-700' },
    media: { name: 'Media', icon: 'Film', color: 'bg-teal-700' },
    missions: { name: 'Missions', icon: 'Globe', color: 'bg-cyan-800' },
    communications: { name: 'Communications & Digital Ministry', icon: 'MessageSquare', color: 'bg-indigo-800' }
  });
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', password: 'admin', name: 'Communications Lead', department: 'communications', role: 'admin', email: 'admin@kyfc.org', phone: '+254 700 000 000' },
    { id: 2, username: 'accounts', password: 'acc123', name: 'John Kamau', department: 'accounts', role: 'head', email: 'john@kyfc.org', phone: '+254 700 000 001' },
    { id: 3, username: 'hr', password: 'hr123', name: 'Mary Wanjiku', department: 'hr', role: 'head', email: 'mary@kyfc.org', phone: '+254 700 000 002' },
    { id: 4, username: 'director', password: 'dir123', name: 'David Ochieng', department: 'nationalDirector', role: 'director', email: 'director@kyfc.org', phone: '+254 700 000 003' },
    { id: 5, username: 'media', password: 'media123', name: 'Grace Akinyi', department: 'media', role: 'head', email: 'grace@kyfc.org', phone: '+254 700 000 004' },
  ]);
  const [editData, setEditData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(null);

  useEffect(() => {
    setRequests([
      {
        id: 1,
        type: 'money',
        requestor: 'John Kamau',
        requestorId: 2,
        department: 'accounts',
        amount: 50000,
        purpose: 'Office supplies and equipment',
        date: '2026-01-10',
        status: 'pending',
        details: { currency: 'KES', urgency: 'medium', account: 'Operational' }
      },
      {
        id: 2,
        type: 'leave',
        requestor: 'Mary Wanjiku',
        requestorId: 3,
        department: 'hr',
        startDate: '2026-01-20',
        endDate: '2026-01-25',
        days: 5,
        reason: 'Annual leave',
        status: 'approved',
        details: { leaveType: 'Annual Leave', coverage: 'James Mwangi' }
      }
    ]);
  }, []);

  const getIcon = (iconName) => {
    const icons = { DollarSign, Users, Briefcase, Film, Globe, MessageSquare };
    return icons[iconName] || Users;
  };

  const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
      if (e) {
        e.preventDefault();
      }
      
      // Trim whitespace from inputs
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      if (!trimmedUsername || !trimmedPassword) {
        setError('Please enter both username and password');
        return;
      }
      
      const user = users.find(u => u.username === trimmedUsername && u.password === trimmedPassword);
      
      if (user) {
        setCurrentUser(user);
        setError('');
      } else {
        setError('Invalid username or password. Try: admin/admin');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-teal-800 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-slate-700 to-teal-700 w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Globe className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Kenya YFC</h1>
            <p className="text-slate-600">Internal Management System</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLogin(e);
                  }
                }}
                className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                placeholder="Enter username"
                autoComplete="off"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLogin(e);
                  }
                }}
                className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                placeholder="Enter password"
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleLogin(e);
              }}
              className="w-full bg-gradient-to-r from-slate-700 to-teal-700 text-white py-3 font-semibold hover:from-slate-800 hover:to-teal-800 transition-all shadow-lg"
            >
              Sign In
            </button>
            
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('admin');
                const user = users.find(u => u.username === 'admin' && u.password === 'admin');
                if (user) {
                  setCurrentUser(user);
                }
              }}
              className="w-full bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 transition-all"
            >
              Quick Login (Admin)
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <p>Demo Logins: admin/admin, accounts/acc123, hr/hr123</p>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const isAdmin = currentUser.role === 'admin';
    const userDept = currentUser.department;
    const canViewAll = isAdmin || currentUser.role === 'director';

    const filteredRequests = canViewAll 
      ? requests 
      : requests.filter(r => r.department === userDept || r.requestorId === currentUser.id);

    const stats = [
      { label: 'Pending Requests', value: filteredRequests.filter(r => r.status === 'pending').length, color: 'from-amber-600 to-orange-700', icon: Clock },
      { label: 'Approved', value: filteredRequests.filter(r => r.status === 'approved').length, color: 'from-emerald-600 to-green-700', icon: Check },
      { label: 'Total Staff', value: users.length, color: 'from-blue-700 to-indigo-800', icon: Users },
      { label: 'Departments', value: Object.keys(departments).length, color: 'from-slate-700 to-slate-800', icon: Briefcase },
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
          <div className="text-sm text-slate-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className={`bg-gradient-to-r ${stat.color} w-12 h-12 flex items-center justify-center mb-4`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-slate-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Requests</h3>
          <div className="space-y-3">
            {filteredRequests.slice(0, 5).map((req) => (
              <div 
                key={req.id}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                onClick={() => setActiveView('requests')}
              >
                <div className="flex items-center space-x-4">
                  <div className={`${departments[req.department]?.color || 'bg-slate-700'} w-10 h-10 flex items-center justify-center`}>
                    {React.createElement(getIcon(departments[req.department]?.icon), { className: "text-white", size: 20 })}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{req.requestor}</div>
                    <div className="text-sm text-slate-600">
                      {req.type === 'money' ? `Money Request: KES ${req.amount.toLocaleString()}` : `Leave: ${req.days} days`}
                    </div>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800 border-amber-300',
      approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const MoneyRequestForm = () => {
    const [formData, setFormData] = useState({
      amount: '',
      purpose: '',
      currency: 'KES',
      urgency: 'medium',
      account: 'Operational',
      date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newRequest = {
        id: requests.length + 1,
        type: 'money',
        requestor: currentUser.name,
        requestorId: currentUser.id,
        department: currentUser.department,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        date: formData.date,
        status: 'pending',
        details: {
          currency: formData.currency,
          urgency: formData.urgency,
          account: formData.account
        }
      };
      setRequests([...requests, newRequest]);
      setFormData({ amount: '', purpose: '', currency: 'KES', urgency: 'medium', account: 'Operational', date: new Date().toISOString().split('T')[0] });
      setShowRequestForm(null);
      alert('Money request submitted successfully!');
    };

    return (
      <div className="bg-white shadow-lg p-8 max-w-2xl">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Money Request Form</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Purpose</label>
            <textarea
              required
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
              rows={4}
              placeholder="Describe the purpose of this request..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
              <select
                value={formData.account}
                onChange={(e) => setFormData({...formData, account: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
              >
                <option value="Operational">Operational</option>
                <option value="Ministry">Ministry</option>
                <option value="Projects">Projects</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-3 font-semibold hover:from-emerald-700 hover:to-teal-800 transition-all shadow-lg"
          >
            Submit Request
          </button>
        </form>
      </div>
    );
  };

  const LeaveRequestForm = () => {
    const [formData, setFormData] = useState({
      startDate: '',
      endDate: '',
      leaveType: 'Annual Leave',
      reason: '',
      coverage: ''
    });

    const calculateDays = () => {
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = Math.ceil((Number(end) - Number(start)) / (1000 * 60 * 60 * 24)) + 1;
        return days > 0 ? days : 0;
      }
      return 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const newRequest = {
        id: requests.length + 1,
        type: 'leave',
        requestor: currentUser.name,
        requestorId: currentUser.id,
        department: currentUser.department,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: calculateDays(),
        reason: formData.reason,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        details: {
          leaveType: formData.leaveType,
          coverage: formData.coverage
        }
      };
      setRequests([...requests, newRequest]);
      setFormData({ startDate: '', endDate: '', leaveType: 'Annual Leave', reason: '', coverage: '' });
      setShowRequestForm(null);
      alert('Leave request submitted successfully!');
    };

    return (
      <div className="bg-white shadow-lg p-8 max-w-2xl">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Leave Request Form</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Leave Type</label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
            >
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {calculateDays() > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-4">
              <p className="text-blue-800 font-semibold">Total Days: {calculateDays()}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
              rows={4}
              placeholder="Explain the reason for your leave..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Coverage</label>
            <input
              type="text"
              required
              value={formData.coverage}
              onChange={(e) => setFormData({...formData, coverage: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
              placeholder="Name of colleague"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-3 font-semibold hover:from-blue-800 hover:to-indigo-900 transition-all shadow-lg"
          >
            Submit Request
          </button>
        </form>
      </div>
    );
  };

  const generateTemplate = (request) => {
    if (request.type === 'money') {
      return `KENYA YOUTH FOR CHRIST - MONEY REQUEST FORM

Request ID: ${request.id}
Date: ${request.date}
Status: ${request.status.toUpperCase()}

REQUESTOR: ${request.requestor}
DEPARTMENT: ${departments[request.department]?.name || request.department}

AMOUNT: ${request.details?.currency || 'KES'} ${request.amount.toLocaleString()}
PURPOSE: ${request.purpose}
ACCOUNT: ${request.details?.account || 'N/A'}
URGENCY: ${request.details?.urgency || 'N/A'}

APPROVAL SECTION:
☐ Approved  ☐ Rejected

Department Head: _________________ Date: _______
National Director: _________________ Date: _______
Finance Officer: _________________ Date: _______

Comments: _______________________________________________`;
    } else {
      return `KENYA YOUTH FOR CHRIST - LEAVE REQUEST FORM

Request ID: ${request.id}
Date: ${request.date || new Date().toISOString().split('T')[0]}
Status: ${request.status.toUpperCase()}

EMPLOYEE: ${request.requestor}
DEPARTMENT: ${departments[request.department]?.name || request.department}

LEAVE TYPE: ${request.details?.leaveType || 'N/A'}
START DATE: ${request.startDate}
END DATE: ${request.endDate}
TOTAL DAYS: ${request.days}
REASON: ${request.reason}
COVERAGE: ${request.details?.coverage || 'N/A'}

APPROVAL SECTION:
☐ Approved  ☐ Rejected

Supervisor: _________________ Date: _______
HR Manager: _________________ Date: _______
National Director: _________________ Date: _______

Comments: _______________________________________________`;
    }
  };

  const downloadTemplate = (request) => {
    const template = generateTemplate(request);
    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${request.type}_request_${request.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const RequestsView = () => {
    const isAdmin = currentUser.role === 'admin';
    const canApprove = isAdmin || currentUser.role === 'director' || currentUser.role === 'head';
    const userDept = currentUser.department;
    const canViewAll = isAdmin || currentUser.role === 'director';

    const filteredRequests = canViewAll 
      ? requests 
      : requests.filter(r => r.department === userDept || r.requestorId === currentUser.id);

    const handleStatusChange = (id, newStatus) => {
      setRequests(requests.map(r => r.id === id ? {...r, status: newStatus} : r));
    };

    const handleDeleteRequest = (id) => {
      if (confirm('Are you sure you want to delete this request?')) {
        setRequests(requests.filter(r => r.id !== id));
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-800">All Requests</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowRequestForm('money')}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-2 font-semibold hover:from-emerald-700 hover:to-teal-800 transition-all shadow-lg flex items-center space-x-2"
            >
              <DollarSign size={18} />
              <span>Money Request</span>
            </button>
            <button
              onClick={() => setShowRequestForm('leave')}
              className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-2 font-semibold hover:from-blue-800 hover:to-indigo-900 transition-all shadow-lg flex items-center space-x-2"
            >
              <Calendar size={18} />
              <span>Leave Request</span>
            </button>
          </div>
        </div>

        {showRequestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setShowRequestForm(null)}
                className="absolute -top-4 -right-4 bg-white p-2 shadow-lg hover:bg-slate-100"
              >
                <X size={24} />
              </button>
              {showRequestForm === 'money' ? <MoneyRequestForm /> : <LeaveRequestForm />}
            </div>
          </div>
        )}

        <div className="bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-700 to-teal-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Requestor</th>
                  <th className="px-6 py-4 text-left">Department</th>
                  <th className="px-6 py-4 text-left">Details</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req, idx) => (
                  <tr key={req.id} className={`border-b hover:bg-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="px-6 py-4 font-semibold">#{req.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold ${req.type === 'money' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                        {req.type === 'money' ? 'Money' : 'Leave'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{req.requestor}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`${departments[req.department]?.color || 'bg-slate-700'} w-8 h-8 flex items-center justify-center`}>
                          {React.createElement(getIcon(departments[req.department]?.icon), { className: "text-white", size: 16 })}
                        </div>
                        <span className="text-sm">{departments[req.department]?.name || req.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {req.type === 'money' 
                        ? `${req.details?.currency || 'KES'} ${req.amount.toLocaleString()}`
                        : `${req.days} days (${req.startDate} to ${req.endDate})`
                      }
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => downloadTemplate(req)}
                          className="bg-blue-600 text-white p-2 hover:bg-blue-700 transition-all"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        {canApprove && req.status === 'pending' && (req.department === userDept || isAdmin || currentUser.role === 'director') && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req.id, 'approved')}
                              className="bg-emerald-600 text-white p-2 hover:bg-emerald-700 transition-all"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, 'rejected')}
                              className="bg-red-600 text-white p-2 hover:bg-red-700 transition-all"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {(isAdmin || req.requestorId === currentUser.id) && (
                          <button
                            onClick={() => handleDeleteRequest(req.id)}
                            className="bg-red-600 text-white p-2 hover:bg-red-700 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const StaffView = () => {
    const isAdmin = currentUser.role === 'admin';
    const canEdit = isAdmin || currentUser.role === 'director' || currentUser.role === 'head';
    const userDept = currentUser.department;

    const filteredUsers = isAdmin || currentUser.role === 'director'
      ? users
      : users.filter(u => u.department === userDept);

    const handleAddStaff = () => {
      setShowAddModal('staff');
    };

    const handleDeleteStaff = (id) => {
      if (confirm('Are you sure you want to delete this staff member?')) {
        setUsers(users.filter(u => u.id !== id));
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-800">Staff Directory</h2>
          {canEdit && (
            <button 
              onClick={handleAddStaff}
              className="bg-gradient-to-r from-slate-700 to-teal-700 text-white px-6 py-2 font-semibold hover:from-slate-800 hover:to-teal-800 transition-all shadow-lg flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Staff</span>
            </button>
          )}
        </div>

        {showAddModal === 'staff' && (
          <AddStaffModal 
            onClose={() => setShowAddModal(null)} 
            onAdd={(newStaff) => {
              setUsers([...users, { ...newStaff, id: users.length + 1 }]);
              setShowAddModal(null);
              alert('Staff member added successfully!');
            }} 
            departments={departments} 
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`${departments[user.department]?.color || 'bg-slate-700'} w-16 h-16 flex items-center justify-center text-white text-2xl font-bold`}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{user.name}</h3>
                  <p className="text-sm text-slate-600">{departments[user.department]?.name || user.department}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-xs font-semibold ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'director' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'head' ? 'bg-teal-100 text-teal-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
              {canEdit && isAdmin && user.id !== currentUser.id && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleDeleteStaff(user.id)}
                    className="flex-1 bg-red-600 text-white py-2 hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AddStaffModal = ({ onClose, onAdd, departments }) => {
    const [formData, setFormData] = useState({
      name: '', username: '', password: '', email: '', phone: '', department: 'accounts', role: 'staff'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onAdd(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white shadow-lg p-8 max-w-2xl w-full relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-600 hover:text-slate-800">
            <X size={24} />
          </button>
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Add New Staff</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
                >
                  {Object.entries(departments).map(([key, dept]) => (
                    <option key={key} value={key}>{(dept as any).name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-teal-600"
                >
                  <option value="staff">Staff</option>
                  <option value="head">Department Head</option>
                  <option value="director">Director</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-3 font-semibold hover:from-emerald-700 hover:to-teal-800 transition-all"
            >
              Add Staff Member
            </button>
          </form>
        </div>
      </div>
    );
  };

  const DepartmentsView = () => {
    const isAdmin = currentUser.role === 'admin';

    const handleAddDepartment = () => {
      const name = prompt('Enter department name:');
      if (name) {
        const key = name.toLowerCase().replace(/\s+/g, '');
        setDepartments({
          ...departments,
          [key]: { name, icon: 'Users', color: 'bg-slate-700' }
        });
      }
    };

    const handleDeleteDepartment = (key) => {
      if (confirm('Are you sure you want to delete this department?')) {
        const newDepts = {...departments};
        delete newDepts[key];
        setDepartments(newDepts);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-800">Departments</h2>
          {isAdmin && (
            <button
              onClick={handleAddDepartment}
              className="bg-gradient-to-r from-slate-700 to-teal-700 text-white px-6 py-2 font-semibold hover:from-slate-800 hover:to-teal-800 transition-all shadow-lg flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Department</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(departments).map(([key, dept]) => {
            const deptUsers = users.filter(u => u.department === key);
            return (
              <div key={key} className="bg-white shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                <div className={`${dept.color} w-16 h-16 flex items-center justify-center mb-4`}>
                  {React.createElement(getIcon(dept.icon), { className: "text-white", size: 32 })}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{(dept as any).name}</h3>
                <div className="text-3xl font-bold text-slate-800 mb-2">{deptUsers.length}</div>
                <p className="text-slate-600 text-sm mb-4">Staff Members</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {deptUsers.slice(0, 3).map(user => (
                    <div key={user.id} className="bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {user.name.split(' ')[0]}
                    </div>
                  ))}
                  {deptUsers.length > 3 && (
                    <div className="bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      +{deptUsers.length - 3} more
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteDepartment(key)}
                    className="w-full bg-red-600 text-white py-2 hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return <LoginScreen />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'requests', label: 'Requests', icon: FileText },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-800 to-teal-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <Globe size={32} />
              <div>
                <h1 className="font-bold text-lg">Kenya YFC</h1>
                <p className="text-xs opacity-80">Management</p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            {sidebarOpen && (
              <button
                onClick={() => onSwitchSystem(null)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded text-sm transition-all"
                title="Switch System"
              >
                Switch System
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white hover:bg-opacity-20 transition-all"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 transition-all ${
                activeView === item.id
                  ? 'bg-white bg-opacity-20 font-semibold'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white border-opacity-20">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} mb-4`}>
            <div className="bg-white bg-opacity-20 w-10 h-10 flex items-center justify-center font-bold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="font-semibold text-sm">{currentUser.name}</p>
                <p className="text-xs opacity-80">{departments[currentUser.department]?.name || currentUser.department}</p>
                <p className="text-xs opacity-60 uppercase">{currentUser.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'requests' && <RequestsView />}
          {activeView === 'staff' && <StaffView />}
          {activeView === 'departments' && <DepartmentsView />}
        </div>
      </div>
    </div>
  );
};

export default Index;
