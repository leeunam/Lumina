#![no_std]
use soroban_sdk::{contractimpl, contracttype, Env, String};

#[contracttype]
#[derive(Clone)]
pub struct Expense {
    pub empresa_id: String,
    pub cliente_id: String,
    pub valor_brl: u64,
    pub timestamp: u64,
    pub status: String,
}

pub struct LivroFiscalContract;

#[contractimpl]
impl LivroFiscalContract {
    pub fn record_expense(env: Env, empresa_id: String, cliente_id: String, valor_brl: u64) -> u64 {
        let timestamp = env.ledger().timestamp();
        let mut count: u64 = env.storage().instance().get(&"count").unwrap_or(0);
        count += 1;

        let expense = Expense {
            empresa_id,
            cliente_id,
            valor_brl,
            timestamp,
            status: String::from_str(&env, "pending"),
        };

        env.storage().instance().set(&count, &expense);
        env.storage().instance().set(&"count", &count);
        env.storage().instance().extend_ttl(100_000, 100_000);

        count
    }
}
