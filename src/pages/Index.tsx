import { Users, Heart, BookOpen, School, Briefcase, UserCheck } from 'lucide-react';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { MetricKey } from '@/components/dashboard/MetricKey';
import { StatCard } from '@/components/dashboard/StatCard';
import { MilestoneCard } from '@/components/dashboard/MilestoneCard';
import { TermTable } from '@/components/dashboard/TermTable';
import { YearComparisonChart } from '@/components/dashboard/YearComparisonChart';
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Index = () => {
  const { milestones, getAvailableYears, getYearTermData, getYearTotals } = useMinistryData();
  const years = getAvailableYears();
  const latestYear = years.length > 0 ? years[years.length - 1] : 2025;
  const yearTerms = getYearTermData(latestYear);
  const grandTotals = getYearTotals(latestYear);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground">{latestYear} Year-to-Date Ministry Tracking</p>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-8">
            <MetricKey />
          </motion.div>

          {/* Grand Totals */}
          <motion.section variants={fadeUp} className="mb-8">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">
              {latestYear} Year-to-Date Totals
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              <StatCard title="Reached" value={grandTotals.reached} icon={Users} variant="primary" delay={0} />
              <StatCard title="Born Again" value={grandTotals.bornAgain} icon={Heart} variant="success" delay={50} />
              <StatCard title="Discipled" value={grandTotals.discipled} icon={BookOpen} variant="info" delay={100} />
              <StatCard title="Baptized" value={grandTotals.bornAgain} icon={UserCheck} variant="warning" delay={150} />
              <StatCard title="In Ministry" value={grandTotals.discipled} icon={Briefcase} variant="accent" delay={200} />
              <StatCard title="Churches" value={grandTotals.schools} icon={School} variant="accent" delay={250} />
            </div>
          </motion.section>

          {/* Term Tables */}
          <motion.section variants={fadeUp} className="mb-8">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">Term Breakdown</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <TermTable data={term1Data} delay={300} />
              <TermTable data={term2Data} delay={400} />
              <TermTable data={term3Data} delay={500} />
            </div>
          </motion.section>

          {/* Milestones */}
          <motion.section variants={fadeUp} className="mb-8">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">Key Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {milestones.map((milestone, index) => (
                <MilestoneCard key={index} milestone={milestone} index={index} delay={600 + index * 100} />
              ))}
            </div>
          </motion.section>

          {/* Year Comparison */}
          <motion.section variants={fadeUp} className="mb-8">
            <YearComparisonChart />
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
