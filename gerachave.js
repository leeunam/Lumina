import { Keypair } from '@stellar/stellar-sdk';

const kp = Keypair.random();

console.log("=== NOVA CHAVE STELLAR ===");
console.log("Public Key (G...):", kp.publicKey());
console.log("Secret Key (S...):", kp.secret());
