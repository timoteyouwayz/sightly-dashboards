import { useParams, Navigate } from 'react-router-dom';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { Users, Heart, BookOpen, School, MapPin, UserCheck } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { TermTable } from '@/components/dashboard/TermTable';
import { MetricKey } from '@/components/dashboard/MetricKey';
import { MilestoneCard } from '@/components/dashboard/MilestoneCard';

const YearPage = () => {
  const { year } = useParams<{ year: string }>();
  const { yearComparisons, milestones, getYearTermData, getYearTotals, allYearTermData, getAvailableYears } = useMinistryData();
  const yearNum = Number(year);

  const availableYears = getAvailableYears();
  const yearExists = availableYears.includes(yearNum) || yearComparisons.some(y => y.year === yearNum);

  if (!yearExists) {
    return <Navigate to="/" replace />;
  }

  const hasTermData = !!allYearTermData[yearNum];
  const yearTerms = getYearTermData(yearNum);
  const totals = getYearTotals(yearNum);

  // If no term data, fall back to yearComparisons summary
  const yearCompData = yearComparisons.find(y => y.year === yearNum);
  const stats = hasTermData ? totals : (yearCompData ?? totals);

  const metrics = [
    { title: 'Reached', value: stats.reached, icon: Users, variant: 'primary' as const },
    { title: 'Born Again', value: stats.bornAgain, icon: Heart, variant: 'success' as const },
    { title: 'Discipled', value: stats.discipled, icon: BookOpen, variant: 'info' as const },
    { title: 'Schools', value: stats.schools, icon: School, variant: 'warning' as const },
    { title: 'Counties', value: stats.counties, icon: MapPin, variant: 'accent' as const },
    { title: 'Partners Trained', value: stats.partnersTrained, icon: UserCheck, variant: 'primary' as const },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">{yearNum} Ministry Report</h2>
          <p className="text-muted-foreground">
            {hasTermData ? 'Full year data with term breakdown' : 'Annual summary'}
          </p>
        </div>

        {/* Metric Key */}
        <div className="mb-8 animate-fade-in">
          <MetricKey />
        </div>

        {/* Stats Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((m, i) => (
              <StatCard key={m.title} title={m.title} value={m.value} icon={m.icon} variant={m.variant} delay={i * 50} />
            ))}
          </div>
        </section>

        {/* Term breakdown if term data exists */}
        {hasTermData && (
          <section className="mb-8">
            <h3 className="text-xl font-display font-semibold text-foreground mb-4">Term Breakdown</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TermTable data={yearTerms.term1} delay={300} year={yearNum} />
              <TermTable data={yearTerms.term2} delay={400} year={yearNum} />
              <TermTable data={yearTerms.term3} delay={500} year={yearNum} />
            </div>
          </section>
        )}

        {/* Milestones for current year */}
        {yearNum === 2025 && milestones.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">Key Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone, index) => (
                <MilestoneCard key={index} milestone={milestone} index={index} delay={600 + index * 100} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default YearPage;
