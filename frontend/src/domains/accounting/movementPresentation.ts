import {
  expenseCategories,
  expenseSubcategories,
  incomeCategories,
  incomeSubcategories,
} from '@/domains/budget/taxonomy';
import type { LedgerAccount, LedgerEntry, LedgerTransaction } from '@/domains/accounting/models';
import { toNumber } from '@/lib/format';

export type MovementClassification = {
  category: string;
  subcategory: string;
};

export type MovementPresentation = {
  accountName: string;
  destinationName: string | null;
  classifications: MovementClassification[];
  classificationState: 'available' | 'missing' | 'not_applicable';
  amount: number;
  aggregateImpact: number;
  currency: string;
  showSign: boolean;
  tone: 'positive' | 'negative' | 'neutral';
};

type PresentationOptions = {
  accounts: LedgerAccount[];
  selectedAccountId?: number;
  accountDisplayName?: (account: LedgerAccount) => string;
};

type AccountFlow = {
  accountEntries: LedgerEntry[];
  destinationEntries: LedgerEntry[];
};

type MovementAmounts = Pick<
  MovementPresentation,
  'amount' | 'aggregateImpact' | 'showSign' | 'tone'
>;

const CLASSIFIABLE_KINDS = new Set(['income', 'expense', 'investment', 'debt_payment']);

function signedAccountImpact(account: LedgerAccount, entry: LedgerEntry, useBase = false): number {
  const amount = toNumber(useBase ? (entry.amount_base ?? entry.amount) : entry.amount);
  const increasesOnDebit = account.account_type === 'asset' || account.account_type === 'expense';
  return (increasesOnDebit ? entry.side === 'debit' : entry.side === 'credit') ? amount : -amount;
}

function uniqueAccountNames(
  entries: LedgerEntry[],
  accountsById: Map<number, LedgerAccount>,
  accountDisplayName: (account: LedgerAccount) => string,
): string {
  return Array.from(
    new Set(
      entries
        .map((entry) => {
          const account = accountsById.get(entry.account_id);
          return account ? accountDisplayName(account) : entry.account_name.trim();
        })
        .filter(Boolean),
    ),
  ).join(' + ');
}

function classificationForEntry(entry: LedgerEntry): MovementClassification | null {
  if (!entry.flow_family || !entry.category_key || !entry.subcategory_key) return null;

  if (entry.flow_family === 'income') {
    const category =
      incomeCategories.find((row) => row.value === entry.category_key)?.label ?? entry.category_key;
    const subcategory =
      incomeSubcategories.find(
        (row) => row.category === entry.category_key && row.value === entry.subcategory_key,
      )?.label ?? entry.subcategory_key;
    return { category, subcategory };
  }

  const category =
    expenseCategories.find((row) => row.value === entry.category_key)?.label ?? entry.category_key;
  const subcategory =
    expenseSubcategories.find(
      (row) => row.category === entry.category_key && row.value === entry.subcategory_key,
    )?.label ?? entry.subcategory_key;
  return { category, subcategory };
}

function transactionClassifications(transaction: LedgerTransaction): MovementClassification[] {
  const unique = new Map<string, MovementClassification>();
  transaction.entries.forEach((entry) => {
    const classification = classificationForEntry(entry);
    if (!classification) return;
    unique.set(`${classification.category}\u0000${classification.subcategory}`, classification);
  });
  return Array.from(unique.values());
}

function impactTone(value: number): MovementPresentation['tone'] {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

function resolveAccountFlow(
  transaction: LedgerTransaction,
  operationalEntries: LedgerEntry[],
): AccountFlow {
  const debitEntries = operationalEntries.filter((entry) => entry.side === 'debit');
  const creditEntries = operationalEntries.filter((entry) => entry.side === 'credit');
  if (transaction.activity_kind === 'income') {
    return { accountEntries: debitEntries, destinationEntries: [] };
  }
  if (transaction.activity_kind === 'expense') {
    return { accountEntries: creditEntries, destinationEntries: [] };
  }
  if (['transfer', 'investment', 'debt_payment'].includes(transaction.activity_kind)) {
    return { accountEntries: creditEntries, destinationEntries: debitEntries };
  }
  const linkedEntry = operationalEntries.find(
    (entry) => entry.asset_id != null || entry.liability_id != null,
  );
  return {
    accountEntries: linkedEntry ? [linkedEntry] : operationalEntries.slice(0, 1),
    destinationEntries: [],
  };
}

function resolveEconomicAmounts(
  transaction: LedgerTransaction,
  amountEntries: LedgerEntry[],
): MovementAmounts {
  const economicSign = transaction.activity_kind === 'income' ? 1 : -1;
  const amount =
    economicSign * amountEntries.reduce((sum, entry) => sum + toNumber(entry.amount), 0);
  const aggregateImpact =
    economicSign *
    amountEntries.reduce((sum, entry) => sum + toNumber(entry.amount_base ?? entry.amount), 0);
  return { amount, aggregateImpact, showSign: true, tone: impactTone(amount) };
}

function resolveMovementAmounts(
  transaction: LedgerTransaction,
  accountEntries: LedgerEntry[],
  operationalEntries: LedgerEntry[],
  accountsById: Map<number, LedgerAccount>,
  selectedAccount?: LedgerAccount,
): MovementAmounts {
  if (selectedAccount) {
    const amount = transaction.entries
      .filter((entry) => entry.account_id === selectedAccount.id)
      .reduce((sum, entry) => sum + signedAccountImpact(selectedAccount, entry), 0);
    return { amount, aggregateImpact: amount, showSign: true, tone: impactTone(amount) };
  }
  if (transaction.activity_kind === 'transfer' || transaction.activity_kind === 'investment') {
    const amount = accountEntries.reduce((sum, entry) => sum + toNumber(entry.amount), 0);
    return { amount, aggregateImpact: 0, showSign: false, tone: 'neutral' };
  }

  const amountEntries = accountEntries.length ? accountEntries : operationalEntries.slice(0, 1);
  if (['income', 'expense', 'debt_payment'].includes(transaction.activity_kind)) {
    return resolveEconomicAmounts(transaction, amountEntries);
  }

  const amount = amountEntries.reduce((sum, entry) => {
    const account = accountsById.get(entry.account_id);
    return account ? sum + signedAccountImpact(account, entry) : sum;
  }, 0);
  const aggregateImpact = amountEntries.reduce((sum, entry) => {
    const account = accountsById.get(entry.account_id);
    return account ? sum + signedAccountImpact(account, entry, true) : sum;
  }, 0);
  return { amount, aggregateImpact, showSign: true, tone: impactTone(amount) };
}

export function buildMovementPresentation(
  transaction: LedgerTransaction,
  options: PresentationOptions,
): MovementPresentation {
  const accountsById = new Map(options.accounts.map((account) => [account.id, account]));
  const displayName = options.accountDisplayName ?? ((account: LedgerAccount) => account.name);
  const operationalEntries = transaction.entries.filter((entry) => {
    const type = accountsById.get(entry.account_id)?.account_type;
    return type === 'asset' || type === 'liability';
  });
  const { accountEntries, destinationEntries } = resolveAccountFlow(
    transaction,
    operationalEntries,
  );

  const selectedAccount =
    options.selectedAccountId == null ? undefined : accountsById.get(options.selectedAccountId);
  const amounts = resolveMovementAmounts(
    transaction,
    accountEntries,
    operationalEntries,
    accountsById,
    selectedAccount,
  );
  const currency = selectedAccount?.currency ?? accountEntries[0]?.currency ?? 'EUR';

  const classifications = transactionClassifications(transaction);
  const classificationState = CLASSIFIABLE_KINDS.has(transaction.activity_kind)
    ? classifications.length
      ? 'available'
      : 'missing'
    : 'not_applicable';

  return {
    accountName:
      uniqueAccountNames(accountEntries, accountsById, displayName) ||
      uniqueAccountNames(operationalEntries, accountsById, displayName) ||
      '-',
    destinationName:
      transaction.activity_kind === 'income' ||
      transaction.activity_kind === 'expense' ||
      !destinationEntries.length
        ? null
        : uniqueAccountNames(destinationEntries, accountsById, displayName) || null,
    classifications,
    classificationState,
    amount: amounts.amount,
    aggregateImpact: amounts.aggregateImpact,
    currency,
    showSign: amounts.showSign,
    tone: amounts.tone,
  };
}
