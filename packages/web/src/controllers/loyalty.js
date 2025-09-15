import { readMethod } from "../services/soroban/client.js";
import { scAddr } from "../services/soroban/toScVal.js";
import { CONTRACTS } from "../config/contracts.js";

// retorna BigInt (ex.: 42n)
export async function getUserPoints({ network = "testnet", address }) {
  const contractId = CONTRACTS[network].loyalty;
  const retval = await readMethod({
    network,
    contractId,
    method: "balance_of",
    args: [scAddr(address)],
  });
  // tenta converter retorno u64 → BigInt (depende do contrato)
  try {
    // muitas bindings expõem .u64() no XDR; fallback para string
    return BigInt(retval?.u64?.() ?? retval?.toString?.() ?? "0");
  } catch { return 0n; }
}
