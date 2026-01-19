import { Users, Heart, BookOpen, School, MapPin, UserCheck } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricKey } from '@/components/dashboard/MetricKey';
import { StatCard } from '@/components/dashboard/StatCard';
import { MilestoneCard } from '@/components/dashboard/MilestoneCard';
import { TermTable } from '@/components/dashboard/TermTable';
import { YearComparisonChart } from '@/components/dashboard/YearComparisonChart';
import { 
  term1Data, 
  term2Data, 
  term3Data, 
  milestones, 
  yearComparisons,
  getGrandTotals 
} from '@/data/ministryData';

const Index = () => {
  const grandTotals = getGrandTotals();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        
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
              title="Schools" 
              value={grandTotals.schools} 
              icon={School} 
              variant="warning"
              delay={150}
            />
            <StatCard 
              title="Counties" 
              value={grandTotals.counties} 
              icon={MapPin} 
              variant="accent"
              delay={200}
            />
            <StatCard 
              title="Partners Trained" 
              value={grandTotals.partnersTrained} 
              icon={UserCheck} 
              variant="primary"
              delay={250}
            />
          </div>
        </section>

        {/* Milestones */}
        <section className="mb-8">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            Milestones
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {milestones.map((milestone, index) => (
              <MilestoneCard 
                key={milestone.label} 
                milestone={milestone}
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* Term Tables */}
        <section className="mb-8">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">
            Monthly Breakdown by Term
          </h2>
          <div className="grid lg:grid-cols-3 gap-4">
            <TermTable data={term1Data} delay={0} />
            <TermTable data={term2Data} delay={100} />
            <TermTable data={term3Data} delay={200} />
          </div>
        </section>

        {/* Year Comparison */}
        <section className="mb-8">
          <YearComparisonChart data={yearComparisons} delay={300} />
        </section>

        {/* Footer */}
        <footer className="text-center py-6 text-muted-foreground text-sm">
          <p>YFC Kenya Ministry Tracking Dashboard • {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
