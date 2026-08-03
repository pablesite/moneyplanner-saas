export type FamilyMember = {
  id: number;
  name: string;
  role: 'adult' | 'child';
  is_active: boolean;
};

export type OwnershipKind = 'individual' | 'shared';
export type OwnershipAllocationBasis = 'explicit_split' | 'recurring_income_12m';

export type OwnershipIncomeRule = {
  category_key: string;
  subcategory_key: string;
};

export type OwnershipRead = {
  id: number;
  kind: OwnershipKind;
  member: { id: number; name: string; role: 'adult' | 'child' } | null;
  splits: { member: { id: number; name: string; role: 'adult' | 'child' }; percent: string }[];
  allocation_basis?: OwnershipAllocationBasis;
  income_rules?: OwnershipIncomeRule[];
  is_in_use: boolean;
};

export type OwnershipAllocationPreview = {
  ownership_id: number;
  allocation_basis: OwnershipAllocationBasis;
  fiscal_year: number;
  month: number;
  status: 'ready' | 'provisional' | 'blocked';
  window_start: string;
  window_end: string;
  base_currency: string;
  quality_reasons: string[];
  observed_months: number;
  eligible_transaction_count: number;
  excluded_transaction_count: number;
  total_qualifying_income: string;
  shares: {
    member_id: number;
    member_name: string;
    qualifying_income: string;
    percent: string;
  }[];
  is_frozen: boolean;
};
