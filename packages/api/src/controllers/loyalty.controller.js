import { ok, badRequest, paymentRequired, conflict, serverError, notFound } from '../utils/http.js'
import { ENV } from '../services/env.service.js'
import { calcPoints, validateCashbackPercent, requiredFundFor } from '../services/reward.service.js'
import { createReservation, getReservation, deleteReservation, timeLeftSeconds, listReservations } from '../services/reservation.store.js'
import { friendbotFund, livroFiscal_record, financeiro_getFundBalance, financeiro_reserve, financeiro_finalize } from '../services/soroban.service.js'

export const health = (_req, res) =>
  ok(res, { network: ENV.NETWORK_PASSPHRASE.includes('Future') ? 'futurenet' : 'custom', rpc: ENV.RPC_URL })

export async function friendbot(req, res){
  try{
    const { account } = req.body || {}
    if(!account) return badRequest(res, 'account obrigatório')
    const data = await friendbotFund(account)
    return ok(res, { funded: true, account, friendbot: data })
  }catch(e){ return serverError(res, e) }
}

export async function recordExpense(req, res){
  try{
    const { merchant_account, amount_brl, metadata } = req.body || {}
    if(!merchant_account || amount_brl == null) return badRequest(res, 'merchant_account e amount_brl são obrigatórios')
    const now = Math.floor(Date.now()/1000)
    const sent = await livroFiscal_record({ merchant_account, amount_brl, timestamp: now, metadata })
    return ok(res, { tx_hash: sent.hash, explorer_url: sent.explorer_url })
  }catch(e){ return serverError(res, e) }
}

export async function reserve(req, res){
  try{
    const { customer_pubkey, amount_brl, cashback_percent, carbon_share_percent } = req.body || {}
    if(!customer_pubkey || amount_brl == null || cashback_percent == null)
      return badRequest(res, 'customer_pubkey, amount_brl e cashback_percent são obrigatórios')

    const cb = validateCashbackPercent(cashback_percent)
    const points = calcPoints(amount_brl)
    const required = requiredFundFor(amount_brl, cb)

    const fundBal = await financeiro_getFundBalance().catch(()=>0)
    if(fundBal < required)
      return paymentRequired(res, 'sem saldo', { fund_balance: fundBal, required_min: required })

    const sent = await financeiro_reserve({
      customer_pubkey,
      points,
      cashback_percent: cb,
      carbon_share_percent: Number(carbon_share_percent ?? ENV.RULES.carbon_share_percent_default)
    })

    const reservation_id = createReservation({
      customer: customer_pubkey,
      amount_brl: Number(amount_brl),
      points,
      cashback_percent: cb,
      carbon_share_percent: Number(carbon_share_percent ?? ENV.RULES.carbon_share_percent_default),
      fund_required: required,
      tx_hash_reserve: sent.hash
    })

    return ok(res, {
      reservation_id,
      points,
      tx_hash: sent.hash,
      explorer_url: sent.explorer_url,
      delay_seconds: ENV.RULES.delay_to_charge_fund_seconds
    })
  }catch(e){
    if(String(e?.message || '').includes('cashback_percent')) return badRequest(res, e.message)
    return serverError(res, e)
  }
}

export async function finalize(req, res){
  try{
    const { reservation_id } = req.body || {}
    if(!reservation_id) return badRequest(res, 'reservation_id é obrigatório')

    const r = getReservation(reservation_id)
    if(!r) return notFound(res, 'reserva não encontrada')

    const left = timeLeftSeconds(r)
    if(left > 0) return conflict(res, 'aguarde delay', { seconds_remaining: left })

    const sent = await financeiro_finalize({ customer_pubkey: r.customer, points: r.points })

    deleteReservation(reservation_id)
    let fund_after = null
    try { fund_after = await financeiro_getFundBalance() } catch {}

    return ok(res, { tx_hash: sent.hash, explorer_url: sent.explorer_url, fund_balance_after: fund_after })
  }catch(e){ return serverError(res, e) }
}

export const debugReservations = (_req, res) => ok(res, { items: listReservations() })
