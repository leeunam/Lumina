import { ENV } from './env.service.js'

const store = new Map()
let nextId = 1

export function createReservation(payload){
  const id = String(nextId++)
  store.set(id, { ...payload, createdAt: Date.now() })
  return id
}
export const getReservation = (id) => store.get(String(id))
export const deleteReservation = (id) => store.delete(String(id))
export const listReservations = () => Object.fromEntries(store)

export function timeLeftSeconds(res){
  const elapsed = (Date.now() - res.createdAt)/1000
  const wait = ENV.RULES.delay_to_charge_fund_seconds - elapsed
  return Math.ceil(Math.max(0, wait))
}
