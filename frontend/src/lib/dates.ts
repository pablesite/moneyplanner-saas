// Helpers de fecha compartidos entre dominios (movimientos, patrimonio...).
// Trabajan con fechas ISO "YYYY-MM-DD" interpretadas en horario local.

// "YYYY-MM-DD" -> Date local a medianoche (evita el desfase de zona horaria de `new Date('YYYY-MM-DD')`).
export function parseIsoToDate(raw: string): Date {
  return new Date(`${raw}T00:00:00`);
}

// Date -> "YYYY-MM-DD".
export function dateToIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// "YYYY-MM-DD" -> etiqueta corta "ene 25" para ejes y listados.
export function formatMonthYearLabel(date: string): string {
  return new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(
    new Date(date),
  );
}
