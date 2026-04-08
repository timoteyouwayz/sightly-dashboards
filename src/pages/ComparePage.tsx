import { useMinistryData } from '@/contexts/MinistryDataContext';
import { YearComparisonChart } from '@/components/dashboard/YearComparisonChart';
import { MilestoneCard } from '@/components/dashboard/MilestoneCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const metricKeys = ['reached', 'bornAgain', 'discipled', 'schools', 'counties', 'partnersTrained'] as const;
const metricLabels: Record<string, string> = {
  reached: 'Reached',
  bornAgain: 'Born Again',
  discipled: 'Discipled',
  schools: 'Schools',
  counties: 'Counties',
  partnersTrained: 'Partners Trained',
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const GrowthCard = ({ label, growth, value }: { label: string; growth: number; value: number }) => {
  const animatedValue = useCountUp(value, 1000);
  const animatedGrowth = useCountUp(Math.abs(growth), 1500);

  return (
    <div className="card-elevated p-4 text-center">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold font-display text-foreground">{animatedValue.toLocaleString()}</p>
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className={`inline-flex items-center gap-1 text-sm font-semibold mt-1 ${
          growth > 0 ? 'text-success' : growth < 0 ? 'text-destructive' : 'text-muted-foreground'
        }`}
      >
        {growth > 0 ? <TrendingUp className="w-3 h-3" /> : growth < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
        {growth > 0 ? '+' : ''}{animatedGrowth.toFixed(1)}%
      </motion.span>
    </div>
  );
};

const ComparePage = () => {
  const { yearComparisons, milestones } = useMinistryData();

  const getGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const latest = yearComparisons.length >= 1 ? yearComparisons[yearComparisons.length - 1] : null;
  const prev = yearComparisons.length >= 2 ? yearComparisons[yearComparisons.length - 2] : null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Year-over-Year Comparison</h2>
            <p className="text-muted-foreground">Compare ministry metrics across all years</p>
          </motion.div>

          {/* Latest Growth Highlights */}
          {latest && prev && (
            <motion.section variants={fadeUp} className="mb-8">
              <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                {latest.year} Growth vs {prev.year}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {metricKeys.map(key => (
                  <GrowthCard
                    key={key}
                    label={metricLabels[key]}
                    value={latest[key]}
                    growth={getGrowth(latest[key], prev[key])}
                  />
                ))}
              </div>
            </motion.section>
          )}

          <motion.section variants={fadeUp} className="mb-8">
            <YearComparisonChart />
          </motion.section>

          {yearComparisons.length >= 2 && (
            <motion.section variants={fadeUp} className="mb-8">
              <h3 className="text-xl font-display font-semibold text-foreground mb-4">Growth Analysis</h3>
              <div className="card-elevated overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header">
                      <TableHead>Metric</TableHead>
                      {yearComparisons.map((y) => (
                        <TableHead key={y.year} className="text-right">{y.year}</TableHead>
                      ))}
                      <TableHead className="text-right">Latest Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metricKeys.map((key) => {
                      const latestVal = yearComparisons[yearComparisons.length - 1][key];
                      const prevVal = yearComparisons[yearComparisons.length - 2][key];
                      const growth = getGrowth(latestVal, prevVal);

                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{metricLabels[key]}</TableCell>
                          {yearComparisons.map((y) => (
                            <TableCell key={y.year} className="text-right font-mono">
                              {y[key].toLocaleString()}
                            </TableCell>
                          ))}
                          <TableCell className="text-right">
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              className={`inline-flex items-center gap-1 font-semibold ${
                                growth > 0 ? 'text-success' : growth < 0 ? 'text-destructive' : 'text-muted-foreground'
                              }`}
                            >
                              {growth > 0 ? <TrendingUp className="w-4 h-4" /> : growth < 0 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                              {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                            </motion.span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </motion.section>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default ComparePage;
