export function parseAnnualAmount(raw: string): number {
  let normalized = String(raw ?? '')
    .trim()
    .replace(/\s/g, '');

  const hasComma = normalized.includes(',');
  const hasDot = normalized.includes('.');
  if (hasComma && hasDot) {
    const lastComma = normalized.lastIndexOf(',');
    const lastDot = normalized.lastIndexOf('.');
    if (lastComma > lastDot) {
      normalized = normalized.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = normalized.replace(/,/g, '');
    }
  } else if (hasComma) {
    normalized = normalized.replace(',', '.');
  }

  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return value;
}

export function normalizeOwnerName(raw: string): string {
  return String(raw ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 120);
}

type AnnualizedEntryLike = {
  amountAnnual: number;
  amountInputPeriod?: 'annual' | 'monthly' | null;
  timeProfile?: string | null;
  termStartMonth?: number | null;
  termEndMonth?: number | null;
  termEndYear?: number | null;
  fiscalYear?: number | null;
};

function roundToMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function clampTermMonths(rawMonth: number | null | undefined, fallback: number): number {
  return Math.min(12, Math.max(1, Number(rawMonth ?? fallback)));
}

// Meses en los que una línea con plazo planifica dentro de un año, con la misma regla que
// el reparto mensual del backend: el mes de inicio solo cuenta en el año de la línea y el
// de fin solo en el año en que termina. Una línea de nov-2026 a oct-2029 da 11-12 en 2026,
// 1-12 en 2027 y 1-10 en 2029.
export function termEntryActiveMonths(
  entry: AnnualizedEntryLike,
  selectedYear?: number | null,
): { startMonth: number; endMonth: number } {
  const targetYear = selectedYear ?? entry.fiscalYear ?? null;
  if (entry.timeProfile !== 'term_recurrent' || targetYear == null) {
    return { startMonth: 1, endMonth: 12 };
  }
  const isFirstYear = entry.fiscalYear == null || entry.fiscalYear === targetYear;
  const startMonth = isFirstYear ? clampTermMonths(entry.termStartMonth, 1) : 1;
  const endsThisYear =
    entry.termEndYear === targetYear || (entry.termEndYear == null && isFirstYear);
  const endMonth = endsThisYear ? clampTermMonths(entry.termEndMonth, 12) : 12;
  return { startMonth, endMonth: Math.max(startMonth, endMonth) };
}

export function effectiveAnnualAmountForEntry(
  entry: AnnualizedEntryLike,
  selectedYear?: number | null,
): number {
  const annualAmount = Number(entry.amountAnnual ?? 0);
  if (!Number.isFinite(annualAmount)) return 0;
  // Una línea mensual guarda la cuota por doce; una anual ya es el importe de sus meses.
  if (entry.timeProfile !== 'term_recurrent' || entry.amountInputPeriod !== 'monthly') {
    return annualAmount;
  }
  const { startMonth, endMonth } = termEntryActiveMonths(entry, selectedYear);
  const months = endMonth - startMonth + 1;
  if (months === 12) return annualAmount;
  return roundToMoney((annualAmount * months) / 12);
}

export function amountInputValueFromStoredAnnual(
  entry: AnnualizedEntryLike,
  period: 'annual' | 'monthly',
  _selectedYear?: number | null,
): string {
  const annualAmount = Number(entry.amountAnnual ?? 0);
  if (!Number.isFinite(annualAmount)) return '0';
  if (period !== 'monthly') return String(annualAmount);
  return String(roundToMoney(annualAmount / 12));
}
