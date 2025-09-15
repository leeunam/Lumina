import { ENV } from "./env.js";

export const CONTRACTS = {
  testnet: { loyalty: ENV.CONTRACT_LOYALTY_ID_TESTNET },
  mainnet: { loyalty: ENV.CONTRACT_LOYALTY_ID_MAINNET },
};
