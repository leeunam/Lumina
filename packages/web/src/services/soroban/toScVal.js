import * as SorobanClient from "soroban-client";
const { Address, nativeToScVal } = SorobanClient;

export const scStr  = (s) => nativeToScVal(s, { type: "string" });
export const scU64  = (n) => nativeToScVal(BigInt(n), { type: "u64" });
export const scAddr = (a) => Address.fromString(a).toScVal();
