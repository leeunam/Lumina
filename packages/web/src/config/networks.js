import { ENV } from "./env.js";

export const NETWORKS = {
  testnet: {
    name: "testnet",
    rpc: ENV.SOROBAN_RPC_TESTNET,
    passphrase: "Test SDF Network ; September 2015",
  },
  mainnet: {
    name: "mainnet",
    rpc: ENV.SOROBAN_RPC_MAINNET,
    passphrase: "Public Global Stellar Network ; September 2015",
  },
};
