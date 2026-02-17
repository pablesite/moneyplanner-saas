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
    return 'No tienes permisos para realizar esta accion.';
  }
  if (code === 'subscription_blocked') {
    return 'Tu suscripcion no habilita esta funcionalidad premium.';
  }
  return null;
}

export function toApiErrorMessage(error: unknown): string {
  const code = getApiErrorCode(error);
  const mapped = humanMessageForApiCode(code);
  if (mapped) return mapped;

  const maybe = error as { response?: { data?: unknown }; message?: string } | null | undefined;
  const data = maybe?.response?.data;
  if (isRecord(data)) {
    const envelope = data as ApiErrorEnvelope;
    if (typeof envelope.error?.message === 'string' && envelope.error.message.length > 0) {
      return envelope.error.message;
    }
  }
  if (typeof data === 'string') return data;
  if (maybe?.message) return maybe.message;
  return 'Error';
}
