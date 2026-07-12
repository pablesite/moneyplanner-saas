import type { PlanMember } from './types';

export function ageInYear(birthDate: string | null, year: number): number | null {
  if (!birthDate) return null;
  const birthYear = Number(birthDate.slice(0, 4));
  return Number.isFinite(birthYear) ? year - birthYear : null;
}

export function yearWithAges(year: number | null, members: PlanMember[]): string {
  if (year == null) return 'Sin fecha';
  const ages = members
    .map((member) => {
      const age = ageInYear(member.birth_date, year);
      return age == null ? null : `${member.name} ${age} años`;
    })
    .filter((value): value is string => Boolean(value));
  return ages.length ? `${year} · ${ages.join(' · ')}` : String(year);
}

export function compactYearWithAges(year: number, members: PlanMember[]): string {
  const ages = members
    .map((member) => ageInYear(member.birth_date, year))
    .filter((age): age is number => age != null);
  return ages.length ? `${year} · ${ages.join('/')} años` : String(year);
}
