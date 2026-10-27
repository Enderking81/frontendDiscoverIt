import { User } from '../models';

// genera un JWT falso (sin firma válida) con el vencimiento indicado: el front solo lee el payload
export function fakeToken(expiresInSeconds: number, payload: Record<string, unknown> = {}): string {
  const body = { id: 1, isAdmin: false, exp: Math.floor(Date.now() / 1000) + expiresInSeconds, ...payload };
  return `header.${btoa(JSON.stringify(body))}.firma`;
}

export const USER: User = { id: 1, nickname: 'mateo', email: 'mateo@test.com', isAdmin: false };
export const ADMIN: User = { id: 2, nickname: 'admin', email: 'admin@test.com', isAdmin: true };

// deja una sesión guardada como lo haría un login real
export function storeSession(user: User, token = fakeToken(3600, { id: user.id, isAdmin: user.isAdmin })) {
  localStorage.setItem('discoverit_token', token);
  localStorage.setItem('discoverit_user', JSON.stringify(user));
}
