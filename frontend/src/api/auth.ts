import type { AuthUser } from '@/stores/authStore';
import { USE_MOCKS } from './index';
import { request } from './client';
import { delay } from '@/mocks/data';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  displayName: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

/**
 * NOTA: El mecanismo definitivo de autenticación está pendiente (Q-13).
 * El servicio mock devuelve un token inventado para desarrollo.
 */
export const login = async (credentials: LoginCredentials): Promise<AuthSession> => {
  if (USE_MOCKS) {
    if (!credentials.email || !credentials.password) {
      throw new Error('Credenciales incompletas');
    }
    return delay(
      {
        user: {
          id: 'me',
          displayName: credentials.email.split('@')[0] ?? 'Usuario',
          email: credentials.email,
        },
        token: 'mock-token-' + Date.now(),
      },
      600,
    );
  }
  return request<AuthSession>('/auth/login', { method: 'POST', body: credentials });
};

export const register = async (credentials: RegisterCredentials): Promise<AuthSession> => {
  if (USE_MOCKS) {
    return delay(
      {
        user: {
          id: 'me',
          displayName: credentials.displayName,
          email: credentials.email,
        },
        token: 'mock-token-' + Date.now(),
      },
      600,
    );
  }
  return request<AuthSession>('/auth/register', { method: 'POST', body: credentials });
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  if (USE_MOCKS) {
    if (!email) throw new Error('Email requerido');
    await delay(null, 500);
    return;
  }
  await request<void>('/auth/password-reset', { method: 'POST', body: { email } });
};
