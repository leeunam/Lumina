import { ENV } from './env.service.js'

export function calcPoints(amount_brl){
  return Math.floor(Number(amount_brl) * ENV.RULES.points_per_brl)
}

export function validateCashbackPercent(p){
  const n = Number(p)
  if(!ENV.RULES.cashback_allowed.includes(n)){
    const allowed = ENV.RULES.cashback_allowed.join(', ')
    throw new Error(`cashback_percent inválido (permitidos: ${allowed})`)
  }
  return n
}

export function requiredFundFor(amount_brl, cashback_percent){
  const cashbackAmount = (Number(amount_brl) * Number(cashback_percent)) / 100
  return Math.ceil(cashbackAmount * (ENV.RULES.min_cashback_percent / 100))
}
