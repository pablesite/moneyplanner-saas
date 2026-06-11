import axios from 'axios';

type ApiErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getApiErrorCode(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  const data = error.response?.data;
  if (!isRecord(data)) return null;
  const envelope = data as ApiErrorEnvelope;
  return typeof envelope.error?.code === 'string' ? envelope.error.code : null;
}

function humanMessageForApiCode(code: string | null): string | null {
  if (code === 'permission_denied') {
    return 'No tienes permisos para realizar esta acción.';
  }
  if (code === 'subscription_blocked') {
    return 'Tu suscripción no habilita esta funcionalidad premium.';
  }
  return null;
}

function humanMessageForAuthFailure(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;

  const status = error.response?.status;
  const url = error.config?.url ?? '';
  if (status === 401 && url.includes('/api/auth/token/')) {
    return 'Usuario o contraseña incorrectos.';
  }

  const data = error.response?.data;
  if (isRecord(data) && typeof data.detail === 'string') {
    if (data.detail.toLowerCase().includes('no active account found')) {
      return 'Usuario o contraseña incorrectos.';
    }
  }

  return null;
}

function messageFromStringValue(value: unknown, path: string[], trim = true): string | null {
  if (typeof value !== 'string') return null;
  const normalized = trim ? value.trim() : value;
  if (!normalized) return null;
  const label = path.length > 0 ? `${path.join('.')}: ` : '';
  return `${label}${normalized}`;
}

function isReservedValidationKey(field: string): boolean {
  return field === 'error' || field === 'code' || field === 'message' || field === 'details';
}

function firstValidationMessage(data: unknown, path: string[] = []): string | null {
  const stringMessage = messageFromStringValue(data, path);
  if (stringMessage) return stringMessage;

  if (Array.isArray(data)) {
    for (const item of data) {
      const nested = firstValidationMessage(item, path);
      if (nested) return nested;
    }
    return null;
  }

  if (!isRecord(data)) return null;

  if ('details' in data) {
    const detailsMessage = firstValidationMessage(data.details, path);
    if (detailsMessage) return detailsMessage;
  }

  const directMessage = messageFromStringValue(data.message, path);
  if (directMessage) return directMessage;

  for (const [field, raw] of Object.entries(data)) {
    if (isReservedValidationKey(field)) continue;
    const nextPath = field === 'detail' ? path : [...path, field];
    const nested = firstValidationMessage(raw, nextPath);
    if (nested) return nested;
  }

  return messageFromStringValue(data.detail, path);
}

export function toApiErrorMessage(error: unknown): string {
  const code = getApiErrorCode(error);
  const mapped = humanMessageForApiCode(code);
  if (mapped) return mapped;

  const authMessage = humanMessageForAuthFailure(error);
  if (authMessage) return authMessage;

  const maybe = error as { response?: { data?: unknown }; message?: string } | null | undefined;
  const data = maybe?.response?.data;
  if (isRecord(data)) {
    const envelope = data as ApiErrorEnvelope;
    const detailsMessage = firstValidationMessage(envelope.error?.details);
    if (detailsMessage) return detailsMessage;

    if (typeof envelope.error?.message === 'string' && envelope.error.message.length > 0) {
      return envelope.error.message;
    }

    const validation = firstValidationMessage(data);
    if (validation) return validation;
  }
  if (typeof data === 'string') return data;
  if (maybe?.message) return maybe.message;
  return 'Error';
}
