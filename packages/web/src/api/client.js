const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const EXPLORER_BASE =
  import.meta.env.VITE_STELLAR_EXPLORER ||
  'https://stellar.expert/explorer/testnet/tx/';

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function recordExpense(payload) {
  return post('/record_expense', payload);
}

export async function reserve(payload) {
  return post('/reserve', payload);
}

export async function finalize(payload) {
  return post('/finalize', payload);
}

export function explorerLink(txHash) {
  if (!txHash) return null;
  return `${EXPLORER_BASE}${txHash}`;
}

export default { recordExpense, reserve, finalize, explorerLink };

export async function getClientStatus(address) {
  try {
    const res = await fetch(
      `${API_BASE}/client_status?address=${encodeURIComponent(address)}`
    );
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}
