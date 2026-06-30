type FormatOpts = {
  currency?: string; // "EUR" | "USD" | "BTC" | "ETH" ...
  maxDecimals?: number; // override manual
};

const decimalsByCurrency: Record<string, number> = {
  EUR: 2,
  USD: 2,
  BTC: 8,
  ETH: 8,
};

export function normalizeNumberInput(raw: unknown) {
  return String(raw ?? '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
}

export function getMaxDecimals(currency?: string) {
  if (!currency) return 2;
  return decimalsByCurrency[currency] ?? 2;
}

// Parse seguro: acepta coma o punto decimal y devuelve 0 ante valores no numéricos.
export function toNumber(value: unknown): number {
  const n = Number(normalizeNumberInput(value));
  return Number.isFinite(n) ? n : 0;
}

// Número con separador de miles y nº fijo de decimales (sin símbolo de divisa).
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Notación compacta para ejes de gráficos: 1,2k / 3,4M / 5,6B.
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${formatNumber(value / 1_000_000_000, 1)}B`;
  if (abs >= 1_000_000) return `${formatNumber(value / 1_000_000, 1)}M`;
  if (abs >= 1_000) return `${formatNumber(value / 1_000, 1)}k`;
  return formatNumber(value, 0);
}

// Símbolo corto para mostrar junto a importes: € para EUR, el código en otro caso.
export function currencySymbol(currency: string | null | undefined): string {
  return currency === 'EUR' ? '€' : String(currency ?? '').trim();
}

// Para cantidades (con separador de miles, sin símbolo)
export function formatAmount(value: unknown, opts: FormatOpts = {}) {
  const s = normalizeNumberInput(value);
  const n = Number(s);
  if (Number.isNaN(n)) return String(value ?? '');

  const max = opts.maxDecimals ?? getMaxDecimals(opts.currency);

  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: max,
  }).format(n);
}

// Para dinero fiat con símbolo opcional (si lo quieres)
export function formatMoney(value: unknown, currency: 'EUR' | 'USD' = 'EUR') {
  const s = normalizeNumberInput(value);
  const n = Number(s);
  if (Number.isNaN(n)) return String(value ?? '');

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
