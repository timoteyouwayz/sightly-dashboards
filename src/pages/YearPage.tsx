import { useParams, Navigate } from 'react-router-dom';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { Users, Heart, BookOpen, School, MapPin, UserCheck } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const YearPage = () => {
  const { year } = useParams<{ year: string }>();
  const { yearComparisons, term1Data, term2Data, term3Data, getGrandTotals } = useMinistryData();
  const yearNum = Number(year);

  // For 2025, show current term data; for others, show from yearComparisons
  const yearData = yearComparisons.find((y) => y.year === yearNum);
  const is2025 = yearNum === 2025;

  if (!yearData && !is2025) {
    return <Navigate to="/" replace />;
  }

  const stats = is2025
    ? getGrandTotals()
    : yearData!;

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
            {is2025 ? 'Current year data with term breakdown' : `Annual summary for ${yearNum}`}
          </p>
        </div>

        {/* Stats Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((m, i) => (
              <StatCard key={m.title} title={m.title} value={m.value} icon={m.icon} variant={m.variant} delay={i * 50} />
            ))}
          </div>
        </section>

        {/* Term breakdown for 2025 */}
        {is2025 && (
          <section className="mb-8">
            <h3 className="text-xl font-display font-semibold text-foreground mb-4">Term Breakdown</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[term1Data, term2Data, term3Data].map((term) => (
                <div key={term.term} className="card-elevated overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted/30">
                    <h4 className="font-display font-semibold text-foreground">Term {term.term}</h4>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="table-header">
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Reached</TableHead>
                        <TableHead className="text-right">Born Again</TableHead>
                        <TableHead className="text-right">Discipled</TableHead>
                        <TableHead className="text-right">Schools</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {term.months.map((m) => (
                        <TableRow key={m.month}>
                          <TableCell className="font-medium text-primary">{m.month}</TableCell>
                          <TableCell className="text-right font-mono">{m.reached.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono text-success">{m.bornAgain.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono text-info">{m.discipled.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono text-warning">{m.schools.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold border-t-2 border-primary/20">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right font-mono">{term.totals.reached.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-success">{term.totals.bornAgain.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-info">{term.totals.discipled.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-warning">{term.totals.schools.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Summary table for historical years */}
        {!is2025 && yearData && (
          <section className="mb-8">
            <div className="card-elevated p-6">
              <h3 className="text-xl font-display font-semibold text-foreground mb-4">Annual Summary</h3>
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((m) => (
                    <TableRow key={m.title}>
                      <TableCell className="font-medium">{m.title}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{m.value.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default YearPage;
