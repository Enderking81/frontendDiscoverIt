import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// los e2e usan la API real para preparar y limpiar datos (el admin sale del .env del backend)
export const API = 'http://localhost:3000/api';

function backendEnv(key: string): string {
  const env = readFileSync(resolve(__dirname, '../../../backendDiscoverIt/.env'), 'utf8');
  const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
  if (!match) throw new Error(`Falta ${key} en el .env del backend`);
  return match[1].trim();
}

export const adminCredentials = () => ({ email: backendEnv('ADMIN_EMAIL'), password: backendEnv('ADMIN_PASSWORD') });

export async function apiLogin(email: string, password: string): Promise<string> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error(`Login falló para ${email}: ${res.status}`);
  return (await res.json()).token;
}

export async function apiRequest<T = unknown>(method: string, path: string, token?: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  return (res.status === 204 ? undefined : await res.json()) as T;
}

// sufijo único para que cada corrida use datos propios y no choque con otras
export const uniqueSuffix = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;
