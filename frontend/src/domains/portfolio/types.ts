export type PortfolioPeriod = {
  from: string;
  to: string;
};

export type PortfolioReturn = {
  nominal: string | null;
  real: string | null;
  twr: string | null;
  mwr_xirr: string | null;
  twr_annualized: string | null;
  method: 'twr' | 'linked_dietz' | 'modified_dietz' | 'unavailable';
  estimated: boolean;
};

export type PortfolioCoverage = {
  value: 'complete' | 'partial';
  opening_positions: { covered: number; total: number };
  closing_positions: { covered: number; total: number };
  cash: 'complete' | 'partial' | 'ownership_unavailable';
  twr: 'exact' | 'estimated' | 'unavailable';
  mwr: 'available' | 'unavailable';
  realized_pnl: 'complete' | 'partial';
  fx: 'complete' | 'partial';
};

export type PortfolioOverview = {
  period: PortfolioPeriod;
  member_id: number | null;
  currency: string;
  value: string | null;
  covered_value: string;
  net_contributed: string;
  monetary_result: string | null;
  return: PortfolioReturn;
  coverage: PortfolioCoverage;
  position_count: number;
  fresh_position_count: number;
};

export type PortfolioPerformance = {
  period: PortfolioPeriod;
  member_id: number | null;
  currency: string;
  opening_value: string | null;
  closing_value: string | null;
  covered_opening_value: string;
  covered_closing_value: string;
  net_contributed: string;
  monetary_result: string | null;
  gross_result: string | null;
  costs: string;
  income: string;
  realized_pnl: string | null;
  unrealized_pnl: string | null;
  return: PortfolioReturn;
  coverage: PortfolioCoverage;
  fx_issues: string[];
};

export type PositionPerformance = {
  position_id: number;
  instrument_id: number;
  instrument_name: string;
  container_id: number;
  container_name: string;
  status: 'active' | 'archived';
  tracking_style: string;
  native_value: string | null;
  native_currency: string | null;
  holding_currency: string;
  observed_on: string | null;
  asset_class: string;
  class_breakdown: { asset_class: string; percent: string }[];
  value_status: 'fresh' | 'stale' | 'missing' | 'at_cost';
  performance: PortfolioPerformance;
  attribution: {
    asset: string | null;
    fx: string | null;
    total: string | null;
    method: 'closing_fx_residual' | 'unavailable';
  };
};

export type PortfolioPositionsResponse = {
  period: PortfolioPeriod;
  member_id: number | null;
  results: PositionPerformance[];
};

export type PortfolioTimelinePoint = {
  date: string;
  value: string | null;
  net_contributed: string;
  contributed_to_date: string;
  monetary_result: string | null;
  coverage: 'complete' | 'partial';
};

export type PortfolioTimeline = {
  period: PortfolioPeriod;
  member_id: number | null;
  currency: string;
  results: PortfolioTimelinePoint[];
};

export type PortfolioQuality = {
  period: PortfolioPeriod;
  status: 'ready' | 'stale' | 'needs_review';
  positions: { total: number; fresh: number; stale: number; missing: number; at_cost: number };
  ownership_missing: number;
  cash_ownership_missing: boolean;
  metric_coverage: PortfolioCoverage;
  fx_issues: string[];
};

export type PortfolioInstrument = {
  id: number;
  name: string;
  asset_class: string;
  instrument_type: string;
  quote_currency: string;
};

export type PortfolioQuery = {
  date_from?: string;
  date_to?: string;
  member_id?: number;
  container_id?: number;
  asset_class?: string;
  currency?: string;
  class_breakdown?: PortfolioClassBreakdownRow[];
};

export type PortfolioWorkspacePayload = {
  // Las posiciones que el filtro de inventario deja dentro, o null si no hay filtro. Todo
  // lo demás del payload —hero, evolución y rentabilidad— describe ya ese subconjunto.
  scope: number[] | null;
  // Efectivo de contenedor, que cuenta en el valor pero no es ninguna posición: sin él
  // la composición sumaba menos que el hero y la liquidez no salía por ningún lado.
  cash: { value: string };
  overview: PortfolioOverview;
  performance: PortfolioPerformance;
  positions: PortfolioPositionsResponse;
  timeline: PortfolioTimeline;
  quality: PortfolioQuality;
  instruments: PortfolioInstrument[];
};

export type PortfolioOperationType =
  | 'transfer'
  | 'buy'
  | 'sell'
  | 'dividend'
  | 'interest'
  | 'fee'
  | 'valuation'
  | 'split'
  | 'identifier_change'
  | 'position_transfer'
  | 'adjustment';

export type PortfolioOperationPosition = {
  id: number;
  name: string;
  ledger_account_id: number | null;
  container_id: number;
  container_name: string;
  tracking_style: string;
  status: 'active' | 'archived';
  operational: boolean;
  history_mode: 'reconstructed' | 'cutoff';
  history_start_date: string | null;
  setup_confirmed: boolean;
  asset_class: string;
  class_breakdown: PortfolioClassBreakdownRow[];
  performance_coverage: {
    status: 'complete' | 'partial' | 'missing';
    start_date: string | null;
    has_flows: boolean;
    has_valuations: boolean;
  };
  position_detail_coverage: {
    status: 'complete' | 'partial' | 'missing' | 'value_only';
    tracks_units: boolean;
  };
};

export type PortfolioClassBreakdownRow = {
  asset_class: string;
  percent: string;
};

export type PortfolioPositionSetupPayload = {
  tracking_style: 'value_based' | 'units_based';
  history_mode: 'reconstructed' | 'cutoff';
  history_start_date: string | null;
  container_id?: number;
  asset_class?: string;
  currency?: string;
  class_breakdown?: PortfolioClassBreakdownRow[];
};

export type PortfolioCashAccount = {
  id: number;
  container_id: number;
  ledger_account_id: number;
  name: string;
  currency: string;
  available: string;
};

export type PortfolioOperationOptions = {
  positions: PortfolioOperationPosition[];
  cash_accounts: PortfolioCashAccount[];
  linkable_cash_accounts: { id: number; name: string; currency: string; balance: string }[];
  // De dónde puede salir el dinero: toda cuenta de liquidez propia, enlazada a un
  // contenedor o no. Las enlazables excluyen justo las que financian una compra dentro
  // de su propia plataforma.
  funding_accounts: { id: number; name: string; currency: string; balance: string }[];
  containers: PortfolioContainer[];
  asset_classes: { value: string; label: string }[];
  container_types: { value: string; label: string }[];
};

export type PortfolioContainer = {
  id: number;
  name: string;
  container_type: string;
  is_active: boolean;
  position_count: number;
};

export type PortfolioContainerPayload = {
  name: string;
  container_type: string;
  is_active?: boolean;
  notes?: string;
};

export type PortfolioOperationPayload = {
  operation_type: PortfolioOperationType;
  booking_date: string;
  position_id?: number;
  target_position_id?: number;
  cash_account_id?: number;
  target_cash_account_id?: number;
  amount?: string;
  destination_amount?: string;
  units?: string;
  unit_price?: string;
  fee?: string;
  currency?: string;
  new_identifier?: string;
  ratio_denominator?: string;
  description?: string;
  external_id?: string;
  note?: string;
  preview_token?: string;
};

export type PortfolioOperationPreview = {
  preview: {
    operation_type: PortfolioOperationType;
    position: { id: number; name: string } | null;
    amount: string;
    fee: string;
    booking_date: string;
    cash?: {
      id: number;
      name: string;
      currency: string;
      available_before: string;
    };
  };
  preview_token: string;
};

export type PortfolioImportRow = {
  id: number;
  row_number: number;
  raw_data: Record<string, string>;
  normalized_data: Record<string, string | number>;
  status: 'pending' | 'valid' | 'error' | 'duplicate' | 'confirmed';
  errors: Record<string, string>;
};

export type PortfolioImportBatch = {
  id: number;
  filename: string;
  status: 'uploaded' | 'previewed' | 'partial' | 'confirmed' | 'failed';
  headers: string[];
  mapping: Record<string, string>;
  row_count: number;
  confirmed_count: number;
  duplicate_file?: boolean;
  rows: PortfolioImportRow[];
};

export type PortfolioValuationResync = {
  positions_checked: number;
  valuations_created: number;
};

export type PositionOwnershipShare = {
  member_id: number;
  percent: string;
};

export type PositionOwnershipPeriod = {
  id: number;
  position_id: number;
  ownership_id: number;
  start_date: string;
  end_date: string | null;
  shares: PositionOwnershipShare[];
  created_at: string;
};

export type PositionOwnershipPeriodPayload = {
  position_id: number;
  ownership_id: number;
  start_date: string;
  shares: PositionOwnershipShare[];
};

// Una línea de política es de una clase o de un producto, nunca de las dos. La de clase
// se declara en % de cartera; la de producto, en % de su clase.
export type AllocationClassTarget = {
  id?: number;
  asset_class: string;
  target_percent: string;
  min_percent: string | null;
  max_percent: string | null;
};

export type AllocationPositionTarget = {
  id?: number;
  position_id: number;
  target_percent: string;
};

export type AllocationTarget = AllocationClassTarget & { position_id?: number | null };

export type AllocationStrategy = {
  id: number;
  ownership_id: number;
  effective_from: string;
  note: string;
  max_cost_share: string;
  min_line_amount: string;
  targets: AllocationTarget[];
  target_total: string;
  created_at: string;
};

export type AllocationStrategyPayload = {
  ownership_id: number;
  effective_from: string;
  note?: string;
  min_line_amount?: string;
  max_cost_share?: string;
  targets: (Omit<AllocationClassTarget, 'id'> | Omit<AllocationPositionTarget, 'id'>)[];
};

// `band` dice si la clase está dentro de su banda de tolerancia, fuera por arriba o por
// abajo, o si es algo que tienes sin haberlo planeado.
export type AllocationRow = {
  asset_class?: string;
  position_id?: number;
  value: string;
  actual_percent: string;
  target_percent: string | null;
  min_percent: string | null;
  max_percent: string | null;
  drift_value: string | null;
  band: 'within' | 'above' | 'below' | 'unplanned';
};

// Fila del segundo nivel: qué le toca a cada producto dentro de su clase. `band` es
// `derived` cuando el objetivo se hereda del reparto de la clase en vez de escribirse.
export type AllocationPositionRow = {
  position_id: number;
  name: string;
  asset_class: string;
  value: string;
  actual_percent: string;
  target_percent: string | null;
  class_share: string | null;
  min_percent: string | null;
  max_percent: string | null;
  drift_value: string | null;
  band: string;
};

export type PortfolioAllocation = {
  ownership_id: number;
  on_date: string;
  currency: string;
  strategy: { id: number; effective_from: string; note: string; target_total: string } | null;
  total_value: string;
  position_count: number;
  // Lo que el presupuesto tenía previsto invertir este mes. Es un punto de partida
  // editable: elegir otra cifra no reescribe el presupuesto.
  suggested_contribution: string;
  by_class: AllocationRow[];
  by_position: AllocationPositionRow[];
};

// Restricciones reales de compra de una posición: lo que hace que una propuesta sea
// ejecutable de verdad y no solo aritméticamente correcta.
export type PositionAllocationRule = {
  id: number;
  position_id: number;
  excluded: boolean;
  min_contribution: string;
  rounding_step: string;
  operation_cost: string;
  fee_free_plan: boolean;
};

// Lo que tiene que llegar a una posición pase lo que pase con la desviación: un mínimo
// mensual que conserva una ventaja del banco, o un cupo anual que además es techo.
export type ContributionCommitment = {
  id: number;
  // O cuelga de un producto o de la plataforma entera: el mínimo de MyInvestor son 300 €
  // al mes en la plataforma, y da igual cómo se repartan por dentro.
  position_id: number | null;
  container_id: number | null;
  period: 'month' | 'year';
  amount: string;
  reason: string;
  // Lo que cuesta al año no cumplirlo: un compromiso no vale por su importe sino por lo
  // que se pierde al romperlo. Decide a quién se atiende cuando no llega para todos.
  breach_cost: string;
  is_active: boolean;
};

export type AllocationScope = {
  ownership_id: number;
  kind: 'individual' | 'shared';
  label: string;
  position_count: number;
  value: string;
  has_strategy: boolean;
};

export type ContributionLine = {
  position_id: number;
  name: string;
  asset_class: string;
  amount: string;
  tax_transferable: boolean;
  target_percent: string;
  gap_before: string;
};

export type ContributionSolve = {
  status: 'ok' | 'no_strategy' | 'incomplete_strategy';
  declared_percent?: string;
  amount: string;
  reserved_cash?: string;
  leftover?: string;
  lines: ContributionLine[];
  commitments?: { position_id: number; amount: string; period: string; reason: string }[];
  accumulate?: { cash_account_id: number; container: string; amount: string; reason: string }[];
  skipped?: {
    position_id: number;
    reason: string;
    amount?: string;
    minimum?: string;
    container?: string;
    operation_cost?: string;
  }[];
  // Clases con objetivo escrito y ningún producto donde colocar el dinero.
  unreachable?: { asset_class: string; target_percent: string; reason: string }[];
  // Compromisos que esta aportación no cubre, con lo que cuesta romperlos.
  unmet_commitments?: {
    position_id: number;
    amount: string;
    period: string;
    reason: string;
    breach_cost: string;
  }[];
};

export type ContributionBasketLine = {
  id: number;
  position_id: number | null;
  cash_account_id: number | null;
  name: string;
  amount: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'skipped';
  confirmed_at: string | null;
};

export type ContributionBasket = {
  id: number;
  ownership_id: number;
  strategy_id: number;
  booking_date: string;
  amount: string;
  reserved_cash: string;
  leftover: string;
  status: 'draft' | 'confirmed' | 'discarded';
  source_account_id: number | null;
  explanation: {
    commitments?: { position_id: number; amount: string; period: string; reason: string }[];
    skipped?: {
      position_id: number;
      reason: string;
      amount?: string;
      minimum?: string;
      container?: string;
      operation_cost?: string;
    }[];
    unreachable?: { asset_class: string; target_percent: string; reason: string }[];
    unmet_commitments?: {
      position_id: number;
      amount: string;
      period: string;
      reason: string;
      breach_cost: string;
    }[];
  };
  lines: ContributionBasketLine[];
  created_at: string;
  confirmed_at: string | null;
};

// Exposición real: dónde está metido el dinero, no en qué envoltorio. Los pesos se
// declaran a mano desde la ficha del fondo, con la fecha de la que salieron.
export type PositionExposure = {
  id: number;
  position_id: number;
  dimension: 'geography' | 'sector' | 'vehicle';
  bucket: string;
  percent: string;
  observed_on: string;
};

export type ExposureDimension = {
  dimension: string;
  label: string;
  // `insufficient` cuando nadie ha declarado nada; `partial` mientras falte cartera por
  // declarar. El reparto se calcula sobre lo cubierto, no sobre el total.
  status: 'ready' | 'partial' | 'insufficient';
  covered_percent: string;
  covered_value: string;
  observed_from: string | null;
  rows: { bucket: string; value: string; percent: string }[];
};

export type PortfolioExposure = {
  on_date: string;
  currency: string;
  total_value: string;
  position_count: number;
  dimensions: ExposureDimension[];
  concentration: {
    top_positions: { position_id: number; name: string; percent: string }[];
    top_five_percent: string;
    diversification_index: string | null;
    // A cuántas posiciones iguales equivale la cartera. Un índice normalizado dice poco;
    // "equivale a 6,7 iguales" se entiende sin explicación.
    effective_positions: string | null;
  };
  overlap: {
    dimension: string;
    left_id: number;
    left_name: string;
    right_id: number;
    right_name: string;
    percent: string;
    shared_value: string;
  }[];
};
