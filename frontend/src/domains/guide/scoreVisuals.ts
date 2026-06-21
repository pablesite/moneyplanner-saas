export type ScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';

type ScorePalette = {
  color: string;
  badgeText: string;
  badgeBg: string;
  badgeBorder: string;
};

const SCORE_PALETTES: Record<ScoreGrade, ScorePalette> = {
  A: {
    color: 'oklch(0.74 0.13 148)',
    badgeText: 'oklch(0.74 0.13 148)',
    badgeBg: 'oklch(0.74 0.13 148 / 0.14)',
    badgeBorder: 'oklch(0.74 0.13 148 / 0.42)',
  },
  B: {
    color: 'oklch(0.74 0.13 115)',
    badgeText: 'oklch(0.74 0.13 115)',
    badgeBg: 'oklch(0.74 0.13 115 / 0.14)',
    badgeBorder: 'oklch(0.74 0.13 115 / 0.42)',
  },
  C: {
    color: 'oklch(0.74 0.13 80)',
    badgeText: 'oklch(0.74 0.13 80)',
    badgeBg: 'oklch(0.74 0.13 80 / 0.14)',
    badgeBorder: 'oklch(0.74 0.13 80 / 0.42)',
  },
  D: {
    color: 'oklch(0.74 0.13 45)',
    badgeText: 'oklch(0.74 0.13 45)',
    badgeBg: 'oklch(0.74 0.13 45 / 0.14)',
    badgeBorder: 'oklch(0.74 0.13 45 / 0.42)',
  },
  E: {
    color: 'oklch(0.74 0.13 24)',
    badgeText: 'oklch(0.74 0.13 24)',
    badgeBg: 'oklch(0.74 0.13 24 / 0.14)',
    badgeBorder: 'oklch(0.74 0.13 24 / 0.42)',
  },
};

export function gradeFromScore(score: number): ScoreGrade {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'E';
}

export function scoreColor(score: number): string {
  return SCORE_PALETTES[gradeFromScore(score)].color;
}

export function scoreBadgeStyle(score: number): Record<string, string> {
  const palette = SCORE_PALETTES[gradeFromScore(score)];
  return {
    background: palette.badgeBg,
    color: palette.badgeText,
    borderColor: palette.badgeBorder,
  };
}
