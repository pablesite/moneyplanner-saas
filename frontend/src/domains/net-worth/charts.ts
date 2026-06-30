import { toNumber } from '@/lib/format';

type SummaryLike = {
  base_currency?: string;
  assets_by_category?: Record<string, string>;
  liabilities_by_category?: Record<string, string>;
};

export type ByCategoryChart = {
  unit: string;
  keys: string[];
  assets: number[];
  liabilities: number[];
};

export function buildByCategoryChart(
  summary: SummaryLike | null,
  baseCurrency: string | null,
): ByCategoryChart {
  const unit = baseCurrency ?? summary?.base_currency ?? 'EUR';
  const assetsBy = summary?.assets_by_category ?? {};
  const liabsBy = summary?.liabilities_by_category ?? {};
  const keys = Array.from(new Set<string>([...Object.keys(assetsBy), ...Object.keys(liabsBy)]));

  return {
    unit,
    keys,
    assets: keys.map((key) => toNumber(assetsBy[key])),
    liabilities: keys.map((key) => Math.max(0, toNumber(liabsBy[key]))),
  };
}
