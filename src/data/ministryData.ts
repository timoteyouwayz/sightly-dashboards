export interface MonthlyData {
  month: string;
  reached: number;
  bornAgain: number;
  discipled: number;
  schools: number;
  counties: number;
  partnersTrained: number;
}

export interface TermData {
  term: number;
  months: MonthlyData[];
  totals: {
    reached: number;
    bornAgain: number;
    discipled: number;
    schools: number;
    counties: number;
    partnersTrained: number;
  };
}

export interface YearComparison {
  year: number;
  reached: number;
  bornAgain: number;
  discipled: number;
  schools: number;
  counties: number;
  partnersTrained: number;
}

export interface Milestone {
  label: string;
  current: number;
  target: number;
  unit: string;
}

// Term 1: Jan-Apr
export const term1Data: TermData = {
  term: 1,
  months: [
    { month: 'Jan', reached: 14121, bornAgain: 4672, discipled: 144, schools: 34, counties: 7, partnersTrained: 45 },
    { month: 'Feb', reached: 31091, bornAgain: 8628, discipled: 726, schools: 86, counties: 5, partnersTrained: 22 },
    { month: 'Mar', reached: 27429, bornAgain: 6143, discipled: 5120, schools: 67, counties: 3, partnersTrained: 0 },
    { month: 'Apr', reached: 13009, bornAgain: 2518, discipled: 0, schools: 1, counties: 5, partnersTrained: 41 },
  ],
  totals: {
    reached: 85650,
    bornAgain: 21931,
    discipled: 5990,
    schools: 188,
    counties: 6,
    partnersTrained: 108,
  }
};

// Term 2: May-Aug
export const term2Data: TermData = {
  term: 2,
  months: [
    { month: 'May', reached: 22249, bornAgain: 6209, discipled: 5538, schools: 67, counties: 0, partnersTrained: 0 },
    { month: 'Jun', reached: 0, bornAgain: 0, discipled: 0, schools: 0, counties: 0, partnersTrained: 0 },
    { month: 'Jul', reached: 0, bornAgain: 0, discipled: 0, schools: 0, counties: 0, partnersTrained: 0 },
    { month: 'Aug', reached: 0, bornAgain: 0, discipled: 0, schools: 0, counties: 0, partnersTrained: 0 },
  ],
  totals: {
    reached: 22249,
    bornAgain: 6209,
    discipled: 5538,
    schools: 67,
    counties: 0,
    partnersTrained: 0,
  }
};

// Term 3: Sep-Dec
export const term3Data: TermData = {
  term: 3,
  months: [
    { month: 'Sep', reached: 0, bornAgain: 0, discipled: 0, schools: 0, counties: 0, partnersTrained: 0 },
    { month: 'Oct', reached: 0, bornAgain: 0, discipled: 0, schools: 0, counties: 0, partnersTrained: 0 },
    { month: 'Nov', reached: 0, bornAgain: 0, discipled: 0, schools: 0, counties: 0, partnersTrained: 0 },
    { month: 'Dec', reached: 0, bornAgain: 0, discipled: 0, schools: 0, counties: 0, partnersTrained: 0 },
  ],
  totals: {
    reached: 0,
    bornAgain: 0,
    discipled: 0,
    schools: 0,
    counties: 0,
    partnersTrained: 0,
  }
};

export const yearComparisons: YearComparison[] = [
  { year: 2023, reached: 68593, bornAgain: 11021, discipled: 4607, schools: 0, counties: 18, partnersTrained: 0 },
  { year: 2024, reached: 139197, bornAgain: 49987, discipled: 35583, schools: 506, counties: 26, partnersTrained: 500 },
  { year: 2025, reached: 230544, bornAgain: 78898, discipled: 0, schools: 353, counties: 26, partnersTrained: 108 },
];

export const milestones: Milestone[] = [
  { label: 'Counties', current: 26, target: 40, unit: 'counties' },
  { label: 'Schools', current: 230, target: 600, unit: 'schools' },
  { label: 'Reached', current: 230544, target: 200000, unit: 'people' },
];

export const metricLabels: Record<string, { label: string; color: string }> = {
  reached: { label: 'Reached', color: 'primary' },
  bornAgain: { label: 'Born Again', color: 'success' },
  discipled: { label: 'Discipled', color: 'info' },
  schools: { label: 'Schools', color: 'warning' },
  counties: { label: 'Counties', color: 'accent' },
  partnersTrained: { label: 'Partners Trained', color: 'secondary' },
};

export const getGrandTotals = () => {
  return {
    reached: term1Data.totals.reached + term2Data.totals.reached + term3Data.totals.reached,
    bornAgain: term1Data.totals.bornAgain + term2Data.totals.bornAgain + term3Data.totals.bornAgain,
    discipled: term1Data.totals.discipled + term2Data.totals.discipled + term3Data.totals.discipled,
    schools: term1Data.totals.schools + term2Data.totals.schools + term3Data.totals.schools,
    counties: term1Data.totals.counties + term2Data.totals.counties + term3Data.totals.counties,
    partnersTrained: term1Data.totals.partnersTrained + term2Data.totals.partnersTrained + term3Data.totals.partnersTrained,
  };
};
