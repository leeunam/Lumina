import * as F from "@stellar/freighter-api";
import { user } from "../models/user.js";

export async function hasFreighter() {
  try { await F.isConnected(); return true; } catch { return false; }
}
export async function connect() {
  const pub = await F.getPublicKey();
  user.setAddress(pub);
  return pub;
}
export function disconnect() {
  user.setAddress(undefined);
}
