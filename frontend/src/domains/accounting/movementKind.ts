// Glifos compartidos por tipo de actividad/movimiento contable.
// Único origen para la lista de movimientos y el alta rápida.
export const MOVEMENT_KIND_GLYPHS: Record<string, string> = {
  income: '↓',
  expense: '↑',
  transfer: '⇄',
  investment: '↗',
  debt_payment: '↘',
  revaluation: '↻',
  adjustment: '±',
  opening_balance: '●',
};

export function movementKindGlyph(kind: string): string {
  return MOVEMENT_KIND_GLYPHS[kind] ?? '•';
}
