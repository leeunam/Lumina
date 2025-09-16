import fetch from 'node-fetch';
import { ENV } from './env.service.js';
import { exec } from 'child_process';
import { promisify } from 'util';
const execp = promisify(exec);

// Helpers to call the installed 'stellar' CLI (installed via cargo)
async function runStellar(cmd) {
  const bin =
    process.env.SOROBAN_BIN || `${process.env.HOME}/.cargo/bin/stellar`;
  try {
    const { stdout, stderr } = await execp(`${bin} ${cmd}`);
    return { stdout: String(stdout || ''), stderr: String(stderr || '') };
  } catch (e) {
    // attach stdout/stderr if available
    const out = e.stdout || '';
    const err = e.stderr || e.message;
    throw new Error(`stellar-cli failed: ${String(err)}\n${String(out)}`);
  }
}

// Deploy a wasm and save alias 'financeiro' (returns stdout)
export async function deployFinanceiro(wasmPath, alias = 'financeiro') {
  const src = ENV.SERVICE_SECRET_KEY;
  if (!src) throw new Error('SERVICE_SECRET_KEY not configured in ENV');
  const rpc = ENV.RPC_URL;
  const np = ENV.NETWORK_PASSPHRASE;
  const cmd = `contract deploy --wasm ${wasmPath} --source-account ${src} --rpc-url ${rpc} --network-passphrase '${np}' --alias ${alias}`;
  return await runStellar(cmd);
}

// Generic invoke wrapper: args is an object {argName: value}
export async function invokeContract(
  contractId,
  fnName,
  args = {},
  send = 'default'
) {
  const src = ENV.SERVICE_SECRET_KEY;
  if (!src) throw new Error('SERVICE_SECRET_KEY not configured in ENV');
  const rpc = ENV.RPC_URL;
  const np = ENV.NETWORK_PASSPHRASE;
  const idPart = `--id ${contractId}`;
  const srcPart = `--source-account ${src}`;
  const netPart = `--rpc-url ${rpc} --network-passphrase '${np}' --send=${send}`;
  const argsParts = Object.entries(args)
    .map(([k, v]) => `-- ${fnName} --${k} ${JSON.stringify(String(v))}`)
    .join(' ');
  // Note: the CLI expects the function and args after a single '--'.
  const cmd = `contract invoke ${idPart} ${srcPart} ${netPart} -- ${fnName} ${Object.entries(
    args
  )
    .map(([k, v]) => `--${k} ${JSON.stringify(String(v))}`)
    .join(' ')}`;
  return await runStellar(cmd);
}

/**
 * Minimal soroban service with mock fallback.
 * For WEB3_MOCK=1 it returns mock tx objects.
 * For real mode, it currently throws to indicate not implemented.
 */

const FRIENDBOT_URL = 'https://friendbot.stellar.org';

export async function friendbotFund(account) {
  if (ENV.WEB3_MOCK) {
    return { funded: true, account };
  }
  const res = await fetch(
    `${FRIENDBOT_URL}?addr=${encodeURIComponent(account)}`
  );
  const data = await res.json();
  return data;
}

export async function livroFiscal_record({
  merchant_id,
  customer_pubkey,
  amount_brl,
}) {
  if (ENV.WEB3_MOCK) {
    const hash = `MOCK-LEDGER-${Date.now()}`;
    return { hash, explorer_url: 'MOCK', expense_id: `exp-${Date.now()}` };
  }
  try {
    // Example: deploy or invoke logic should be implemented by the team.
    // Here we attempt a benign call to ensure CLI works; replace with real deploy/invoke commands.
    const res = await runStellar('contract invoke --help');
    return {
      hash: `CLI-OUT`,
      explorer_url: 'CLI',
      expense_id: `exp-cli`,
      raw: res.stdout,
    };
  } catch (e) {
    throw new Error(`Live Soroban invocation failed: ${e.message}`);
  }
}

export async function financeiro_getFundBalance() {
  if (ENV.WEB3_MOCK) return 1000000;
  try {
    // try to use alias saved as 'financeiro' in config
    const contractId = process.env.FINANCEIRO_ID || 'financeiro';
    const out = await invokeContract(contractId, 'get_fund_balance', {}, 'no');
    // attempt to parse number from stdout
    const s = out.stdout || '';
    const m = s.match(/(\d+)/);
    if (m) return Number(m[1]);
    return 0;
  } catch (e) {
    throw new Error(`Live Soroban invocation failed: ${e.message}`);
  }
}

export async function financeiro_reserve({
  customer_pubkey,
  points,
  cashback_percent,
  carbon_share_percent,
}) {
  if (ENV.WEB3_MOCK) {
    const hash = `MOCK-RESERVE-${Date.now()}`;
    return { hash, explorer_url: 'MOCK' };
  }
  try {
    const contractId = process.env.FINANCEIRO_ID || 'financeiro';
    const reservationId = `r-${Date.now()}`;
    const args = { reservation_id: reservationId, amount: Math.ceil(points) };
    const res = await invokeContract(contractId, 'reserve', args, 'yes');
    return {
      hash: `CLI-RESERVE`,
      explorer_url: 'CLI',
      raw: res.stdout,
      reservation_id: reservationId,
    };
  } catch (e) {
    throw new Error(`Live Soroban invocation failed: ${e.message}`);
  }
}

export async function financeiro_finalize({ customer_pubkey, points }) {
  if (ENV.WEB3_MOCK) {
    const hash = `MOCK-FINALIZE-${Date.now()}`;
    return { hash, explorer_url: 'MOCK' };
  }
  try {
    const contractId = process.env.FINANCEIRO_ID || 'financeiro';
    // For finalize we assume reservation_id is provided in customer_pubkey arg for now
    const args = { reservation_id: customer_pubkey };
    const res = await invokeContract(contractId, 'finalize', args, 'yes');
    return { hash: `CLI-FINALIZE`, explorer_url: 'CLI', raw: res.stdout };
  } catch (e) {
    throw new Error(`Live Soroban invocation failed: ${e.message}`);
  }
}
