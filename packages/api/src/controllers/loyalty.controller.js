import {
  ok,
  badRequest,
  paymentRequired,
  conflict,
  serverError,
  notFound,
} from '../utils/http.js';
import { ENV } from '../services/env.service.js';
import {
  calcPoints,
  validateCashbackPercent,
  requiredFundFor,
} from '../services/reward.service.js';
import {
  createReservation,
  getReservation,
  deleteReservation,
  timeLeftSeconds,
  listReservations,
} from '../services/reservation.store.js';
import {
  friendbotFund,
  livroFiscal_record,
  financeiro_getFundBalance,
  financeiro_reserve,
  financeiro_finalize,
} from '../services/soroban.service.js';

export const health = (_req, res) =>
  ok(res, {
    network: ENV.NETWORK_PASSPHRASE.includes('Future') ? 'futurenet' : 'custom',
    rpc: ENV.RPC_URL,
  });

export async function friendbot(req, res) {
  try {
    const { account } = req.body || {};
    if (!account) return badRequest(res, 'account obrigatório');
    const data = await friendbotFund(account);
    return ok(res, { funded: true, account, friendbot: data });
  } catch (e) {
    return serverError(res, e);
  }
}

export async function recordExpense(req, res) {
  try {
    const { merchant_id, customer_pubkey, amount_brl } = req.body || {};
    if (!merchant_id || !customer_pubkey || !amount_brl)
      return badRequest(
        res,
        'merchant_id, customer_pubkey e amount_brl são obrigatórios'
      );

    // 1) record on-chain (or mock)
    const rec = await livroFiscal_record({
      merchant_id,
      customer_pubkey,
      amount_brl,
    });
    // return tx_hash and explorer url
    const payload = {
      expense_id: rec.expense_id || null,
      tx_hash: rec.hash || null,
      explorer_url: rec.explorer_url || null,
    };
    console.log('[recordExpense] ->', payload);
    try {
      require('fs').appendFileSync(
        '/tmp/luar_api.log',
        `[recordExpense] ${JSON.stringify(payload)}\n`
      );
    } catch (e) {}
    return ok(res, payload);
  } catch (e) {
    return serverError(res, e);
  }
}

export async function reserve(req, res) {
  try {
    const {
      expense_id,
      merchant_id,
      customer_pubkey,
      amount_brl,
      cashback_percent,
      carbon_share_percent,
    } = req.body || {};
    if (!expense_id || !merchant_id || !customer_pubkey || !amount_brl)
      return badRequest(
        res,
        'expense_id, merchant_id, customer_pubkey e amount_brl são obrigatórios'
      );

    // validate cashback percent
    let cb =
      cashback_percent !== undefined
        ? validateCashbackPercent(cashback_percent)
        : ENV.RULES.cashback_allowed[0];

    const points = calcPoints(amount_brl);
    const requiredFund = requiredFundFor(amount_brl, cb);

    // create local reservation
    const reservationId = await createReservation({
      expense_id,
      merchant: merchant_id,
      customer: customer_pubkey,
      amount_brl: Number(amount_brl),
      points,
      cashback_percent: cb,
      carbon_share_percent: Number(
        carbon_share_percent || ENV.RULES.carbon_share_percent_default
      ),
    });

    // call financeiro reserve (on-chain or mock) -- this records reservation on-chain
    const sent = await financeiro_reserve({
      customer_pubkey: customer_pubkey,
      points,
      cashback_percent: cb,
      carbon_share_percent: Number(
        carbon_share_percent || ENV.RULES.carbon_share_percent_default
      ),
    });

    const reservePayload = {
      reservation_id: reservationId,
      points,
      cashback_brl: requiredFund,
      tx_hash: sent.hash,
      explorer_url: sent.explorer_url,
    };
    console.log('[reserve] ->', reservePayload);
    try {
      require('fs').appendFileSync(
        '/tmp/luar_api.log',
        `[reserve] ${JSON.stringify(reservePayload)}\n`
      );
    } catch (e) {}
    return ok(res, reservePayload);
  } catch (e) {
    return serverError(res, e);
  }
}

export async function finalize(req, res) {
  try {
    const { reservation_id } = req.body || {};
    if (!reservation_id) return badRequest(res, 'reservation_id é obrigatório');

    const r = await getReservation(reservation_id);
    if (!r) return notFound(res, 'reservation não encontrada');

    // check delay
    const left = timeLeftSeconds(r);
    if (left > 0)
      return conflict(res, 'aguarde delay', { seconds_remaining: left });

    // check fund - financeiro_getFundBalance may throw; use it
    const fund = await financeiro_getFundBalance();
    const required = requiredFundFor(
      r.amount_brl,
      r.cashback_percent || ENV.RULES.cashback_allowed[0]
    );
    if (fund < required) return paymentRequired(res, 'sem saldo');

    // finalize on-chain (platform signs)
    const sent = await financeiro_finalize({
      customer_pubkey: r.customer,
      points: r.points,
    });

    // delete reservation locally
    await deleteReservation(reservation_id);

    let fund_after = null;
    try {
      fund_after = await financeiro_getFundBalance();
    } catch {}

    const finalizePayload = {
      tx_hash: sent.hash,
      explorer_url: sent.explorer_url,
      fund_balance_after: fund_after,
    };
    console.log('[finalize] ->', finalizePayload);
    try {
      require('fs').appendFileSync(
        '/tmp/luar_api.log',
        `[finalize] ${JSON.stringify(finalizePayload)}\n`
      );
    } catch (e) {}
    return ok(res, finalizePayload);
  } catch (e) {
    return serverError(res, e);
  }
}

export const debugReservations = async (_req, res) =>
  ok(res, { items: await listReservations() });

export async function clientStatus(req, res) {
  try {
    const address = req.query.address;
    if (!address) return badRequest(res, 'address é obrigatório');
    // read balance via soroban service or loyalty contract (use mock if needed)
    // For simplicity, return reservations related to this user and a mock points balance
    const reservations = (await listReservations()).filter(
      (r) => r.payload.customer === address
    );
    // attempt to read points via contrato loyalty if available
    let points = 0;
    try {
      // optional: call soroban service read method (not implemented here)
    } catch {}
    const cashback = reservations.reduce(
      (s, r) => s + (r.payload.cashback_brl || 0),
      0
    );
    const carbon = reservations.reduce(
      (s, r) => s + (r.payload.carbon_share_percent || 0),
      0
    );
    const payload = {
      points,
      cashback,
      carbon_kg: carbon,
      last_tx: reservations[0]?.payload?.tx_hash ?? null,
    };
    console.log('[clientStatus] ->', { address, payload });
    try {
      require('fs').appendFileSync(
        '/tmp/luar_api.log',
        `[clientStatus] ${address} ${JSON.stringify(payload)}\n`
      );
    } catch (e) {}
    return ok(res, payload);
  } catch (e) {
    return serverError(res, e);
  }
}

export async function adminSummary(_req, res) {
  try {
    const items = await listReservations();
    let total_expenses = items.reduce(
      (s, r) => s + (r.payload.amount_brl || 0),
      0
    );
    const points_emitted = items.reduce(
      (s, r) => s + (r.payload.points || 0),
      0
    );
    let fund_balance = null;
    try {
      fund_balance = await financeiro_getFundBalance();
    } catch {}
    const recent_txs = items
      .slice(-10)
      .map((r) => ({ hash: r.payload.tx_hash || null, type: 'reserve' }));
    const payload = {
      total_expenses,
      points_emitted,
      fund_balance,
      recent_txs,
    };
    console.log('[adminSummary] ->', payload);
    try {
      require('fs').appendFileSync(
        '/tmp/luar_api.log',
        `[adminSummary] ${JSON.stringify(payload)}\n`
      );
    } catch (e) {}
    return ok(res, payload);
  } catch (e) {
    return serverError(res, e);
  }
}
