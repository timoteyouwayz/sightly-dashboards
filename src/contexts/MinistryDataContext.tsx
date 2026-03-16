import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  TermData, 
  Milestone, 
  YearComparison,
  term1Data as initialTerm1,
  term2Data as initialTerm2,
  term3Data as initialTerm3,
  milestones as initialMilestones,
  yearComparisons as initialYearComparisons,
} from '@/data/ministryData';

export interface YearTermData {
  term1: TermData;
  term2: TermData;
  term3: TermData;
}

const createEmptyTermData = (termNum: number, months: string[]): TermData => ({
  term: termNum,
  months: months.map(month => ({
    month,
    reached: 0,
    bornAgain: 0,
    discipled: 0,
    schools: 0,
    counties: 0,
    partnersTrained: 0,
  })),
  totals: { reached: 0, bornAgain: 0, discipled: 0, schools: 0, counties: 0, partnersTrained: 0 },
});

const createEmptyYearTerms = (): YearTermData => ({
  term1: createEmptyTermData(1, ['Jan', 'Feb', 'Mar', 'Apr']),
  term2: createEmptyTermData(2, ['May', 'Jun', 'Jul', 'Aug']),
  term3: createEmptyTermData(3, ['Sep', 'Oct', 'Nov', 'Dec']),
});

interface MinistryDataContextType {
  // Legacy accessors for 2025 (backward compat)
  term1Data: TermData;
  term2Data: TermData;
  term3Data: TermData;
  milestones: Milestone[];
  yearComparisons: YearComparison[];
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  updateTermData: (term: number, monthIndex: number, field: string, value: number) => void;
  updateMilestone: (index: number, field: 'current' | 'target', value: number) => void;
  addMilestone: (milestone: Milestone) => void;
  deleteMilestone: (index: number) => void;
  addYearComparison: (year: YearComparison) => void;
  updateYearComparison: (index: number, field: string, value: number) => void;
  deleteYearComparison: (index: number) => void;
  resetTermData: (term: number) => void;
  getGrandTotals: () => {
    reached: number;
    bornAgain: number;
    discipled: number;
    schools: number;
    counties: number;
    partnersTrained: number;
  };
  // Multi-year support
  allYearTermData: Record<number, YearTermData>;
  getYearTermData: (year: number) => YearTermData;
  updateYearTermData: (year: number, term: number, monthIndex: number, field: string, value: number) => void;
  resetYearTermData: (year: number, term: number) => void;
  getYearTotals: (year: number) => {
    reached: number;
    bornAgain: number;
    discipled: number;
    schools: number;
    counties: number;
    partnersTrained: number;
  };
  getAvailableYears: () => number[];
  deleteYear: (year: number) => void;
}

const MinistryDataContext = createContext<MinistryDataContextType | undefined>(undefined);

const recalculateTotals = (months: TermData['months']): TermData['totals'] => {
  return months.reduce(
    (acc, month) => ({
      reached: acc.reached + month.reached,
      bornAgain: acc.bornAgain + month.bornAgain,
      discipled: acc.discipled + month.discipled,
      schools: acc.schools + month.schools,
      counties: acc.counties + month.counties,
      partnersTrained: acc.partnersTrained + month.partnersTrained,
    }),
    { reached: 0, bornAgain: 0, discipled: 0, schools: 0, counties: 0, partnersTrained: 0 }
  );
};

export const MinistryDataProvider = ({ children }: { children: ReactNode }) => {
  const [allYearTermData, setAllYearTermData] = useState<Record<number, YearTermData>>({
    2025: { term1: initialTerm1, term2: initialTerm2, term3: initialTerm3 },
  });
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [yearComparisons, setYearComparisons] = useState<YearComparison[]>(initialYearComparisons);
  const [isEditMode, setIsEditMode] = useState(false);

  // Backward compat: 2025 term data
  const term1Data = allYearTermData[2025]?.term1 ?? createEmptyTermData(1, ['Jan', 'Feb', 'Mar', 'Apr']);
  const term2Data = allYearTermData[2025]?.term2 ?? createEmptyTermData(2, ['May', 'Jun', 'Jul', 'Aug']);
  const term3Data = allYearTermData[2025]?.term3 ?? createEmptyTermData(3, ['Sep', 'Oct', 'Nov', 'Dec']);

  const getYearTermData = (year: number): YearTermData => {
    return allYearTermData[year] ?? createEmptyYearTerms();
  };

  const updateYearTermData = (year: number, term: number, monthIndex: number, field: string, value: number) => {
    setAllYearTermData(prev => {
      const yearData = prev[year] ?? createEmptyYearTerms();
      const termKey = `term${term}` as keyof YearTermData;
      const termData = yearData[termKey];
      const newMonths = [...termData.months];
      newMonths[monthIndex] = { ...newMonths[monthIndex], [field]: value };
      return {
        ...prev,
        [year]: {
          ...yearData,
          [termKey]: {
            ...termData,
            months: newMonths,
            totals: recalculateTotals(newMonths),
          },
        },
      };
    });
  };

  const resetYearTermData = (year: number, term: number) => {
    const monthNames = term === 1 ? ['Jan', 'Feb', 'Mar', 'Apr'] : term === 2 ? ['May', 'Jun', 'Jul', 'Aug'] : ['Sep', 'Oct', 'Nov', 'Dec'];
    setAllYearTermData(prev => {
      const yearData = prev[year] ?? createEmptyYearTerms();
      const termKey = `term${term}` as keyof YearTermData;
      return {
        ...prev,
        [year]: {
          ...yearData,
          [termKey]: createEmptyTermData(term, monthNames),
        },
      };
    });
  };

  // Legacy updateTermData for 2025
  const updateTermData = (term: number, monthIndex: number, field: string, value: number) => {
    updateYearTermData(2025, term, monthIndex, field, value);
  };

  const resetTermData = (term: number) => {
    resetYearTermData(2025, term);
  };

  const getYearTotals = (year: number) => {
    const data = getYearTermData(year);
    return {
      reached: data.term1.totals.reached + data.term2.totals.reached + data.term3.totals.reached,
      bornAgain: data.term1.totals.bornAgain + data.term2.totals.bornAgain + data.term3.totals.bornAgain,
      discipled: data.term1.totals.discipled + data.term2.totals.discipled + data.term3.totals.discipled,
      schools: data.term1.totals.schools + data.term2.totals.schools + data.term3.totals.schools,
      counties: data.term1.totals.counties + data.term2.totals.counties + data.term3.totals.counties,
      partnersTrained: data.term1.totals.partnersTrained + data.term2.totals.partnersTrained + data.term3.totals.partnersTrained,
    };
  };

  const getGrandTotals = () => getYearTotals(2025);

  const getAvailableYears = () => {
    const years = new Set<number>();
    yearComparisons.forEach(y => years.add(y.year));
    Object.keys(allYearTermData).forEach(y => years.add(Number(y)));
    return Array.from(years).sort((a, b) => a - b);
  };

  const updateMilestone = (index: number, field: 'current' | 'target', value: number) => {
    setMilestones(prev => {
      const newMilestones = [...prev];
      newMilestones[index] = { ...newMilestones[index], [field]: value };
      return newMilestones;
    });
  };

  const addMilestone = (milestone: Milestone) => {
    setMilestones(prev => [...prev, milestone]);
  };

  const deleteMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const addYearComparison = (year: YearComparison) => {
    setYearComparisons(prev => [...prev, year].sort((a, b) => a.year - b.year));
    // Also create empty term data for the new year if it doesn't exist
    setAllYearTermData(prev => {
      if (prev[year.year]) return prev;
      return { ...prev, [year.year]: createEmptyYearTerms() };
    });
  };

  const updateYearComparison = (index: number, field: string, value: number) => {
    setYearComparisons(prev => {
      const newYears = [...prev];
      newYears[index] = { ...newYears[index], [field]: value };
      return newYears;
    });
  };

  const deleteYearComparison = (index: number) => {
    setYearComparisons(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <MinistryDataContext.Provider
      value={{
        term1Data,
        term2Data,
        term3Data,
        milestones,
        yearComparisons,
        isEditMode,
        setIsEditMode,
        updateTermData,
        updateMilestone,
        addMilestone,
        deleteMilestone,
        addYearComparison,
        updateYearComparison,
        deleteYearComparison,
        resetTermData,
        getGrandTotals,
        allYearTermData,
        getYearTermData,
        updateYearTermData,
        resetYearTermData,
        getYearTotals,
        getAvailableYears,
      }}
    >
      {children}
    </MinistryDataContext.Provider>
  );
};

export const useMinistryData = () => {
  const context = useContext(MinistryDataContext);
  if (!context) {
    throw new Error('useMinistryData must be used within MinistryDataProvider');
  }
  return context;
};
