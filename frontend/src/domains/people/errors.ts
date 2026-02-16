import axios from 'axios';

export function toPeopleErrorMessage(err: unknown): string {
  if (!axios.isAxiosError(err)) return String(err);

  const data: unknown = err.response?.data;
  if (!data) return err.message;

  if (typeof data === 'string') return data;

  if (typeof data === 'object' && data !== null) {
    const map = data as Record<string, unknown>;
    if (typeof map.detail === 'string') return map.detail;

    const firstKey = Object.keys(map)[0];
    if (!firstKey) return err.message;
    const value = map[firstKey];
    if (Array.isArray(value)) return String(value[0] ?? err.message);
    if (typeof value === 'string') return value;
  }

  return err.message;
}
