import { TermData } from '@/data/ministryData';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { EditableCell } from './EditableCell';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TermTableProps {
  data: TermData;
  delay?: number;
  year?: number;
}

export const TermTable = ({ data, delay = 0, year = 2025 }: TermTableProps) => {
  const { updateYearTermData, resetYearTermData, isEditMode } = useMinistryData();

  const handleUpdate = (monthIndex: number, field: string, value: number) => {
    updateYearTermData(year, data.term, monthIndex, field, value);
  };

  return (
    <div 
      className="card-elevated overflow-hidden animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Term {data.term}
        </h3>
        {isEditMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resetYearTermData(year, data.term)}
            className="text-muted-foreground hover:text-destructive gap-1"
            title="Reset all values to zero"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead className="w-16">Month</TableHead>
              <TableHead className="text-right">R</TableHead>
              <TableHead className="text-right">B</TableHead>
              <TableHead className="text-right">D</TableHead>
              <TableHead className="text-right">S</TableHead>
              <TableHead className="text-right">C</TableHead>
              <TableHead className="text-right">P</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.months.map((month, index) => (
              <TableRow 
                key={month.month}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium text-primary">{month.month}</TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={month.reached} 
                    onSave={(v) => handleUpdate(index, 'reached', v)}
                    className="font-mono"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={month.bornAgain} 
                    onSave={(v) => handleUpdate(index, 'bornAgain', v)}
                    className="font-mono text-success"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={month.discipled} 
                    onSave={(v) => handleUpdate(index, 'discipled', v)}
                    className="font-mono text-info"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={month.schools} 
                    onSave={(v) => handleUpdate(index, 'schools', v)}
                    className="font-mono text-warning"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={month.counties} 
                    onSave={(v) => handleUpdate(index, 'counties', v)}
                    className="font-mono text-accent"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <EditableCell 
                    value={month.partnersTrained} 
                    onSave={(v) => handleUpdate(index, 'partnersTrained', v)}
                    className="font-mono"
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-semibold border-t-2 border-primary/20">
              <TableCell className="text-foreground">Total</TableCell>
              <TableCell className="text-right font-mono">{data.totals.reached.toLocaleString()}</TableCell>
              <TableCell className="text-right font-mono text-success">{data.totals.bornAgain.toLocaleString()}</TableCell>
              <TableCell className="text-right font-mono text-info">{data.totals.discipled.toLocaleString()}</TableCell>
              <TableCell className="text-right font-mono text-warning">{data.totals.schools.toLocaleString()}</TableCell>
              <TableCell className="text-right font-mono text-accent">{data.totals.counties.toLocaleString()}</TableCell>
              <TableCell className="text-right font-mono">{data.totals.partnersTrained.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
