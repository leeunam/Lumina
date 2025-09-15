
import * as StellarSdk from '@stellar/stellar-sdk'
const {
  Contract,
  Keypair,
  TransactionBuilder,
  nativeToScVal,
  scValToNative
} = StellarSdk

// Fallback: algumas versões exportam como SorobanRpc, outras como rpc
const SorobanRpc = StellarSdk.SorobanRpc ?? StellarSdk.rpc
if (!SorobanRpc) {
  throw new Error(
    'SorobanRpc não disponível no @stellar/stellar-sdk. Instale uma versão 12+ (ex.: pnpm add @stellar/stellar-sdk@^12).'
  )
}

import { ENV } from './env.service.js'

const rpc = new SorobanRpc.Server(ENV.RPC_URL, { allowHttp: true })
const signer = ENV.SERVICE_SECRET_KEY ? Keypair.fromSecret(ENV.SERVICE_SECRET_KEY) : null

const explorerUrl = (hash) => `https://stellar.expert/explorer/futurenet/tx/${hash}`
const loadAccount = (pub) => rpc.getAccount(pub)

async function buildInvokeTx(sourcePub, contractId, fn, scArgs=[]){
  const source = await loadAccount(sourcePub)
  const contract = new Contract(contractId)
  const op = contract.call(fn, ...scArgs)
  return new TransactionBuilder(source, { fee: '100000', networkPassphrase: ENV.NETWORK_PASSPHRASE })
    .addOperation(op).setTimeout(30).build()
}

async function simulateAndAssemble(tx){
  const sim = await rpc.simulateTransaction(tx)
  if (SorobanRpc.Api.isSimulationError(sim)) throw new Error('Falha na simulação: ' + JSON.stringify(sim, null, 2))
  const { transactionData, minResourceFee, results } = sim
  tx = TransactionBuilder.cloneFrom(tx, { fee: (Number(minResourceFee)+100000).toString(), networkPassphrase: ENV.NETWORK_PASSPHRASE })
  tx.setSorobanData(transactionData)
  return { tx, results }
}

async function signAndSend(tx){
  if(!signer) throw new Error('SERVICE_SECRET_KEY ausente')
  tx.sign(signer)
  const sent = await rpc.sendTransaction(tx)
  if (sent.status === 'PENDING'){
    let res = await rpc.getTransaction(sent.hash)
    const t0 = Date.now()
    while(res.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND && Date.now()-t0 < 20000){
      await new Promise(r=>setTimeout(r,1000))
      res = await rpc.getTransaction(sent.hash)
    }
    if(res.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) return { hash: sent.hash, explorer_url: explorerUrl(sent.hash) }
    throw new Error('Transação não confirmada a tempo: ' + sent.hash)
  }
  if (sent.status === 'ERROR') throw new Error('Erro no envio: ' + JSON.stringify(sent, null, 2))
  return { hash: sent.hash, explorer_url: explorerUrl(sent.hash) }
}

/* ------- Funções de alto nível ------- */
export async function friendbotFund(account){
  const url = `https://friendbot-futurenet.stellar.org/?addr=${encodeURIComponent(account)}`
  const r = await fetch(url)
  const txt = await r.text()           // <-- captura corpo sempre
  try {
    const json = JSON.parse(txt)
    if (!r.ok) throw new Error(`Friendbot ${r.status}: ${txt}`)
    return json
  } catch {
    // não era JSON; devolve texto bruto
    if (!r.ok) throw new Error(`Friendbot ${r.status}: ${txt}`)
    return { raw: txt }
  }
}


export async function livroFiscal_record({ merchant_account, amount_brl, timestamp, metadata }){
  if(ENV.WEB3_MOCK) return { hash: `MOCK-${Date.now()}`, explorer_url: 'MOCK' }
  const args = [
    nativeToScVal(merchant_account, { type: 'string' }),
    nativeToScVal(Number(amount_brl), { type: 'i128' }),
    nativeToScVal(Number(timestamp), { type: 'u64' }),
    nativeToScVal(metadata || '', { type: 'string' })
  ]
  let tx = await buildInvokeTx(signer.publicKey(), ENV.LIVRO_FISCAL_ID, 'record', args)
  const { tx: t2 } = await simulateAndAssemble(tx)
  return signAndSend(t2)
}

export async function financeiro_getFundBalance(){
  if(ENV.WEB3_MOCK) return 1000000
  let tx = await buildInvokeTx(signer.publicKey(), ENV.FINANCEIRO_ID, 'get_fund_balance', [])
  const { tx: t2, results } = await simulateAndAssemble(tx)
  const ret = results?.[0]?.retval
  return ret ? Number(scValToNative(ret)) : 0
}

export async function financeiro_reserve({ customer_pubkey, points, cashback_percent, carbon_share_percent }){
  if(ENV.WEB3_MOCK) return { hash: `MOCK-${Date.now()}`, explorer_url: 'MOCK' }
  const args = [
    nativeToScVal(customer_pubkey, { type: 'string' }),
    nativeToScVal(points, { type: 'u128' }),
    nativeToScVal(Number(cashback_percent), { type: 'u32' }),
    nativeToScVal(Number(carbon_share_percent), { type: 'u32' })
  ]
  let tx = await buildInvokeTx(signer.publicKey(), ENV.FINANCEIRO_ID, 'reserve', args)
  const { tx: t2 } = await simulateAndAssemble(tx)
  return signAndSend(t2)
}

export async function financeiro_finalize({ customer_pubkey, points }){
  if(ENV.WEB3_MOCK) return { hash: `MOCK-${Date.now()}`, explorer_url: 'MOCK' }
  const args = [
    nativeToScVal(customer_pubkey, { type: 'string' }),
    nativeToScVal(points, { type: 'u128' })
  ]
  let tx = await buildInvokeTx(signer.publicKey(), ENV.FINANCEIRO_ID, 'finalize', args)
  const { tx: t2 } = await simulateAndAssemble(tx)
  return signAndSend(t2)
}
