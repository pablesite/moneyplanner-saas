import { describe, expect, it } from 'vitest';
import { buildMovementPresentation } from '../movementPresentation';
import type { LedgerAccount, LedgerEntry, LedgerTransaction } from '../models';

const accounts: LedgerAccount[] = [
  makeAccount(1, 'ING', 'asset', 'EUR'),
  makeAccount(2, 'MyInvestor', 'asset', 'EUR'),
  makeAccount(3, 'Broker USD', 'asset', 'USD'),
  makeAccount(4, 'Ingresos sin categoria', 'income', 'EUR'),
  makeAccount(5, 'Tarjeta', 'liability', 'EUR'),
  makeAccount(6, 'Gastos sin categoria', 'expense', 'EUR'),
];

function makeAccount(
  id: number,
  name: string,
  account_type: LedgerAccount['account_type'],
  currency: string,
): LedgerAccount {
  return {
    id,
    name,
    display_name: name,
    account_type,
    currency,
    origin: 'user',
    asset_id: null,
    liability_id: null,
    is_active: true,
    notes: '',
    current_balance: '0',
    created_at: '',
    updated_at: '',
  };
}

function makeEntry(
  account_id: number,
  side: LedgerEntry['side'],
  amount: string,
  overrides: Partial<LedgerEntry> = {},
): LedgerEntry {
  const account = accounts.find((row) => row.id === account_id)!;
  return {
    id: account_id,
    account_id,
    account_name: account.name,
    side,
    amount,
    amount_base: amount,
    currency: account.currency,
    flow_family: '',
    category_key: '',
    subcategory_key: '',
    asset_id: null,
    liability_id: null,
    notes: '',
    created_at: '',
    updated_at: '',
    ...overrides,
  };
}

function makeTransaction(
  activity_kind: string,
  entries: LedgerEntry[],
  overrides: Partial<LedgerTransaction> = {},
): LedgerTransaction {
  return {
    id: 1,
    booking_date: '2026-06-07',
    value_date: '2026-06-07',
    description: 'Movimiento',
    status: 'posted',
    origin: 'manual',
    member_tag: '',
    notes: '',
    ownership_id: null,
    quick_entry_kind: activity_kind as LedgerTransaction['quick_entry_kind'],
    investment_direction: '',
    realized_cost_basis: null,
    realized_gain_loss: null,
    activity_kind,
    entries,
    created_at: '',
    updated_at: '',
    ...overrides,
  };
}

describe('buildMovementPresentation', () => {
  it('shows a transfer amount without treating it as aggregate income', () => {
    const transaction = makeTransaction('transfer', [
      makeEntry(2, 'debit', '1000'),
      makeEntry(1, 'credit', '1000'),
    ]);

    const row = buildMovementPresentation(transaction, { accounts });

    expect(row).toMatchObject({
      accountName: 'ING',
      destinationName: 'MyInvestor',
      amount: 1000,
      aggregateImpact: 0,
      showSign: false,
      tone: 'neutral',
      classificationState: 'not_applicable',
    });
  });

  it('uses the selected account impact for both sides of an investment contribution', () => {
    const transaction = makeTransaction(
      'investment',
      [
        makeEntry(2, 'debit', '1000', {
          flow_family: 'expense',
          category_key: 'financial_investments',
          subcategory_key: 'index_funds',
        }),
        makeEntry(1, 'credit', '1000'),
      ],
      { investment_direction: 'inflow' },
    );

    const liquidityRow = buildMovementPresentation(transaction, {
      accounts,
      selectedAccountId: 1,
    });
    const investmentRow = buildMovementPresentation(transaction, {
      accounts,
      selectedAccountId: 2,
    });

    expect(liquidityRow.amount).toBe(-1000);
    expect(investmentRow.amount).toBe(1000);
    expect(investmentRow.classifications).toEqual([
      { category: 'Inversión financiera', subcategory: 'Fondos indexados' },
    ]);
  });

  it('reverses origin and destination for a divestment', () => {
    const transaction = makeTransaction(
      'investment',
      [
        makeEntry(1, 'debit', '750'),
        makeEntry(2, 'credit', '750', {
          flow_family: 'income',
          category_key: 'capital_gains',
          subcategory_key: 'sale_financial_assets',
        }),
      ],
      { investment_direction: 'outflow' },
    );

    const row = buildMovementPresentation(transaction, { accounts });

    expect(row.accountName).toBe('MyInvestor');
    expect(row.destinationName).toBe('ING');
    expect(row.amount).toBe(750);
    expect(row.showSign).toBe(false);
  });

  it('uses the selected account currency in a cross-currency transfer', () => {
    const transaction = makeTransaction('transfer', [
      makeEntry(3, 'debit', '1080', { amount_base: '1000' }),
      makeEntry(1, 'credit', '1000'),
    ]);

    const destinationRow = buildMovementPresentation(transaction, {
      accounts,
      selectedAccountId: 3,
    });

    expect(destinationRow.amount).toBe(1080);
    expect(destinationRow.currency).toBe('USD');
  });

  it('keeps a card expense negative globally and positive as liability impact', () => {
    const transaction = makeTransaction('expense', [
      makeEntry(6, 'debit', '50', {
        flow_family: 'expense',
        category_key: 'consumption_expenses',
        subcategory_key: 'living_expenses',
      }),
      makeEntry(5, 'credit', '50'),
    ]);

    const globalRow = buildMovementPresentation(transaction, { accounts });
    const cardRow = buildMovementPresentation(transaction, { accounts, selectedAccountId: 5 });

    expect(globalRow.amount).toBe(-50);
    expect(globalRow.aggregateImpact).toBe(-50);
    expect(cardRow.amount).toBe(50);
  });
});
