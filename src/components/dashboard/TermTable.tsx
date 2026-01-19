import { TermData } from '@/data/ministryData';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { EditableCell } from './EditableCell';
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
}

export const TermTable = ({ data, delay = 0 }: TermTableProps) => {
  const { updateTermData } = useMinistryData();

  const handleUpdate = (monthIndex: number, field: string, value: number) => {
    updateTermData(data.term, monthIndex, field, value);
  };

  return (
    <div 
      className="card-elevated overflow-hidden animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Term {data.term}
        </h3>
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
