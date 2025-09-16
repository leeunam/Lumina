import { getDb } from './db.js';
import { ENV } from './env.service.js';

export async function createReservation(payload) {
  const db = await getDb();
  const id = String(Math.random().toString(36).substring(2, 9)); // Simple random ID
  const createdAt = Date.now();
  await db.run(
    'INSERT INTO reservations (id, payload, createdAt) VALUES (?, ?, ?)',
    [id, JSON.stringify(payload), createdAt]
  );
  return id;
}

export async function getReservation(id) {
  const db = await getDb();
  const res = await db.get(
    'SELECT * FROM reservations WHERE id = ?',
    String(id)
  );
  if (!res) {
    return null;
  }
  return { ...res, payload: JSON.parse(res.payload) };
}

export async function deleteReservation(id) {
  const db = await getDb();
  await db.run('DELETE FROM reservations WHERE id = ?', String(id));
}

export async function listReservations() {
  const db = await getDb();
  const rows = await db.all('SELECT * FROM reservations');
  return rows.map((row) => ({ ...row, payload: JSON.parse(row.payload) }));
}

export function timeLeftSeconds(res) {
  const elapsed = (Date.now() - res.createdAt) / 1000;
  const wait = ENV.RULES.delay_to_charge_fund_seconds - elapsed;
  return Math.ceil(Math.max(0, wait));
}
