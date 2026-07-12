import type { PlanMember } from './types';

/** Fecha del cumpleaños en el que se alcanza `age`. El 29/02 cae al 28 en años no bisiestos. */
export function dateAtAge(birthDate: string, age: number): string {
  const [year, month, day] = birthDate.split('-').map(Number);
  if (!year || !month || !day) return '';
  const candidate = new Date(Date.UTC(year + age, month - 1, day));
  if (candidate.getUTCMonth() !== month - 1) candidate.setUTCDate(0);
  return candidate.toISOString().slice(0, 10);
}

/** Edad alcanzada en `isoDate`, contando solo años cumplidos. */
export function ageAtDate(birthDate: string, isoDate: string): number | null {
  if (!birthDate || !isoDate) return null;
  const birth = new Date(`${birthDate}T00:00:00Z`);
  const target = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(target.getTime())) return null;
  let age = target.getUTCFullYear() - birth.getUTCFullYear();
  const beforeBirthday =
    target.getUTCMonth() < birth.getUTCMonth() ||
    (target.getUTCMonth() === birth.getUTCMonth() && target.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

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
