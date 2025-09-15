
import * as StellarSdk from '@stellar/stellar-sdk'
const { Networks } = StellarSdk
import 'dotenv/config'


const parseList = (str) => String(str || '').split(',').map(s => Number(String(s).trim())).filter(Boolean)

export const ENV = {
  PORT: Number(process.env.PORT || 3000),
  RPC_URL: process.env.RPC_URL || 'https://rpc-futurenet.stellar.org',
  NETWORK_PASSPHRASE: process.env.NETWORK_PASSPHRASE || Networks.FUTURENET,
  LIVRO_FISCAL_ID: process.env.LIVRO_FISCAL_ID || 'CB_REPLACE_LIVRO_FISCAL_ID',
  FINANCEIRO_ID: process.env.FINANCEIRO_ID || 'CB_REPLACE_FINANCEIRO_ID',
  SERVICE_SECRET_KEY: process.env.SERVICE_SECRET_KEY || '',
  WEB3_MOCK: String(process.env.WEB3_MOCK || '1') === '1',
  RULES: {
    points_per_brl: Number(process.env.POINTS_PER_BRL || 1),
    cashback_allowed: parseList(process.env.CASHBACK_ALLOWED || '3,5,7'),
    min_cashback_percent: Number(process.env.MIN_CASHBACK_PERCENT || 50),
    delay_to_charge_fund_seconds: Number(process.env.DELAY_TO_CHARGE || 300),
    carbon_share_percent_default: Number(process.env.CARBON_SHARE_PERCENT || 0),
    carbon_price_per_kg_brl: Number(process.env.CARBON_PRICE_PER_KG_BRL || 0),
  }
}
