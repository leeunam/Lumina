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
    return ok(res, {
      expense_id: rec.expense_id || null,
      tx_hash: rec.hash || null,
      explorer_url: rec.explorer_url || null,
    });
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

    return ok(res, {
      reservation_id: reservationId,
      points,
      cashback_brl: requiredFund,
      tx_hash: sent.hash,
      explorer_url: sent.explorer_url,
    });
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

    return ok(res, {
      tx_hash: sent.hash,
      explorer_url: sent.explorer_url,
      fund_balance_after: fund_after,
    });
  } catch (e) {
    return serverError(res, e);
  }
}

export const debugReservations = async (_req, res) =>
  ok(res, { items: await listReservations() });
