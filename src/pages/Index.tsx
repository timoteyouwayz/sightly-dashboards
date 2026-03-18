import { Users, Heart, BookOpen, School, Briefcase, UserCheck } from 'lucide-react';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { MetricKey } from '@/components/dashboard/MetricKey';
import { StatCard } from '@/components/dashboard/StatCard';
import { MilestoneCard } from '@/components/dashboard/MilestoneCard';
import { TermTable } from '@/components/dashboard/TermTable';

const Index = () => {
  const { term1Data, term2Data, term3Data, milestones, getGrandTotals } = useMinistryData();
  const grandTotals = getGrandTotals();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">Dashboard </h2>
          <p className="text-muted-foreground">2025 Year-to-Date Ministry Tracking</p>
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
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            Key Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone, index) =>
            <MilestoneCard key={index} milestone={milestone} index={index} delay={600 + index * 100} />
            )}
          </div>
        </section>
      </div>
    </div>);

};

export default Index;