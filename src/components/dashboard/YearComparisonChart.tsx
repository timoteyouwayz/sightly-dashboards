import { useMinistryData } from '@/contexts/MinistryDataContext';
import { EditableCell } from './EditableCell';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddYearDialog } from './AddYearDialog';

export const YearComparisonChart = ({ delay = 0 }: { delay?: number }) => {
  const { yearComparisons, isEditMode, updateYearComparison, deleteYearComparison } = useMinistryData();

  return (
    <div 
      className="card-elevated p-6 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Year-over-Year Comparison
        </h3>
        <AddYearDialog />
      </div>

      <div className="h-80 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={yearComparisons} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => value.toLocaleString()}
            />
            <Legend />
            <Bar 
              dataKey="reached" 
              name="Reached"
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="bornAgain" 
              name="Born Again"
              fill="hsl(var(--success))" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="discipled" 
              name="Discipled"
              fill="hsl(var(--info))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Editable Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Year</TableHead>
              <TableHead className="text-right">Reached</TableHead>
              <TableHead className="text-right">Born Again</TableHead>
              <TableHead className="text-right">Discipled</TableHead>
              <TableHead className="text-right">Schools</TableHead>
              <TableHead className="text-right">Counties</TableHead>
              <TableHead className="text-right">Partners</TableHead>
              {isEditMode && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {yearComparisons.map((year, index) => (
              <TableRow key={year.year} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-primary">{year.year}</TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={year.reached} 
                    onSave={(v) => updateYearComparison(index, 'reached', v)}
                    className="font-mono"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={year.bornAgain} 
                    onSave={(v) => updateYearComparison(index, 'bornAgain', v)}
                    className="font-mono text-success"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={year.discipled} 
                    onSave={(v) => updateYearComparison(index, 'discipled', v)}
                    className="font-mono text-info"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={year.schools} 
                    onSave={(v) => updateYearComparison(index, 'schools', v)}
                    className="font-mono text-warning"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={year.counties} 
                    onSave={(v) => updateYearComparison(index, 'counties', v)}
                    className="font-mono text-accent"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={year.partnersTrained} 
                    onSave={(v) => updateYearComparison(index, 'partnersTrained', v)}
                    className="font-mono"
                  />
                </TableCell>
                {isEditMode && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteYearComparison(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
