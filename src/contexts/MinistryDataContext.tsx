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

interface MinistryDataContextType {
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
  const [term1Data, setTerm1Data] = useState<TermData>(initialTerm1);
  const [term2Data, setTerm2Data] = useState<TermData>(initialTerm2);
  const [term3Data, setTerm3Data] = useState<TermData>(initialTerm3);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [yearComparisons, setYearComparisons] = useState<YearComparison[]>(initialYearComparisons);
  const [isEditMode, setIsEditMode] = useState(false);

  const updateTermData = (term: number, monthIndex: number, field: string, value: number) => {
    const updateTerm = (prev: TermData): TermData => {
      const newMonths = [...prev.months];
      newMonths[monthIndex] = { ...newMonths[monthIndex], [field]: value };
      return {
        ...prev,
        months: newMonths,
        totals: recalculateTotals(newMonths),
      };
    };

    if (term === 1) setTerm1Data(updateTerm);
    else if (term === 2) setTerm2Data(updateTerm);
    else if (term === 3) setTerm3Data(updateTerm);
  };

  const resetTermData = (term: number) => {
    const createEmptyTerm = (termNum: number, months: string[]): TermData => ({
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

    if (term === 1) setTerm1Data(createEmptyTerm(1, ['Jan', 'Feb', 'Mar', 'Apr']));
    else if (term === 2) setTerm2Data(createEmptyTerm(2, ['May', 'Jun', 'Jul', 'Aug']));
    else if (term === 3) setTerm3Data(createEmptyTerm(3, ['Sep', 'Oct', 'Nov', 'Dec']));
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

  const getGrandTotals = () => ({
    reached: term1Data.totals.reached + term2Data.totals.reached + term3Data.totals.reached,
    bornAgain: term1Data.totals.bornAgain + term2Data.totals.bornAgain + term3Data.totals.bornAgain,
    discipled: term1Data.totals.discipled + term2Data.totals.discipled + term3Data.totals.discipled,
    schools: term1Data.totals.schools + term2Data.totals.schools + term3Data.totals.schools,
    counties: term1Data.totals.counties + term2Data.totals.counties + term3Data.totals.counties,
    partnersTrained: term1Data.totals.partnersTrained + term2Data.totals.partnersTrained + term3Data.totals.partnersTrained,
  });

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
