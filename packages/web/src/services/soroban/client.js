import * as SorobanClient from "soroban-client";
const { SorobanRpc, Contract, TransactionBuilder, BASE_FEE, Address } = SorobanClient;
import { NETWORKS } from "../../config/networks.js";

function server(network) {
  return new SorobanRpc.Server(NETWORKS[network].rpc, { allowHttp: true });
}

// leitura (simulate) — não exige assinatura do usuário
export async function readMethod({ network, contractId, method, args = [] }) {
  const s = server(network);
  const c = new Contract(contractId);
  const source = Address.random(); // apenas para simulate
  const tx = new TransactionBuilder(source.toMuxedAccount(), {
    fee: BASE_FEE,
    networkPassphrase: NETWORKS[network].passphrase,
  })
    .addOperation(c.call(method, ...args))
    .setTimeout(30)
    .build();

  const sim = await s.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationSuccess(sim)) return sim.result?.retval;
  throw new Error("simulate failed");
}
