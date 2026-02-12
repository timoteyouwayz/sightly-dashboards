import { useMinistryData } from '@/contexts/MinistryDataContext';
import { YearComparisonChart } from '@/components/dashboard/YearComparisonChart';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
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

const ComparePage = () => {
  const { yearComparisons } = useMinistryData();

  const getGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">Year-over-Year Comparison</h2>
          <p className="text-muted-foreground">Compare ministry metrics across all years</p>
        </div>

        {/* Chart */}
        <section className="mb-8">
          <YearComparisonChart />
        </section>

        {/* Growth Analysis */}
        {yearComparisons.length >= 2 && (
          <section className="mb-8">
            <h3 className="text-xl font-display font-semibold text-foreground mb-4">Growth Analysis</h3>
            <div className="card-elevated overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Metric</TableHead>
                    {yearComparisons.map((y, i) => (
                      <TableHead key={y.year} className="text-right">{y.year}</TableHead>
                    ))}
                    {yearComparisons.length >= 2 && (
                      <TableHead className="text-right">Latest Growth</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metricKeys.map((key) => {
                    const latest = yearComparisons[yearComparisons.length - 1][key];
                    const prev = yearComparisons[yearComparisons.length - 2][key];
                    const growth = getGrowth(latest, prev);

                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{metricLabels[key]}</TableCell>
                        {yearComparisons.map((y) => (
                          <TableCell key={y.year} className="text-right font-mono">
                            {y[key].toLocaleString()}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center gap-1 font-semibold ${
                            growth > 0 ? 'text-success' : growth < 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            {growth > 0 ? <TrendingUp className="w-4 h-4" /> : growth < 0 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                            {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
