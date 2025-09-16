#![no_std]
use soroban_sdk::{contract, contractimpl, Env, String};

// Use a simple string key for storage to avoid Symbol const issues.
const COUNTER_KEY: &str = "COUNTER";

#[contract]
pub struct FinanceiroContract;

#[contractimpl]
impl FinanceiroContract {
    // deposit fund into the platform account (simple increment)
    pub fn deposit(env: Env, amount: u128) {
        let mut bal: u128 = env.storage().instance().get(&"fund_balance").unwrap_or(0u128);
        bal = bal.saturating_add(amount);
        env.storage().instance().set(&"fund_balance", &bal);
    }

    pub fn get_fund_balance(env: Env) -> u128 {
        env.storage().instance().get(&"fund_balance").unwrap_or(0u128)
    }

    // Reserve an amount for a customer; store reservation by id
    pub fn reserve(env: Env, reservation_id: String, amount: u128) {
        env.storage().instance().set(&reservation_id, &amount);
    }

    // Finalize a reservation: deduct fund and remove reservation
    pub fn finalize(env: Env, reservation_id: String) -> bool {
        let maybe_amt: Option<u128> = env.storage().instance().get(&reservation_id);
        if maybe_amt.is_none() {
            return false;
        }
        let amt = maybe_amt.unwrap();
        let mut bal: u128 = env.storage().instance().get(&"fund_balance").unwrap_or(0u128);
        if bal < amt {
            return false;
        }
        bal = bal - amt;
        env.storage().instance().set(&"fund_balance", &bal);
        env.storage().instance().remove(&reservation_id);
        true
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env, testutils::Accounts};

    #[test]
    fn test_deposit_reserve_finalize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, FinanceiroContract);
        let client = FinanceiroContractClient::new(&env, &contract_id);

        client.deposit(1000u128);
        assert_eq!(client.get_fund_balance(), 1000u128);

        client.reserve(String::from_slice(&env, "r1"), 300u128);
        let ok = client.finalize(String::from_slice(&env, "r1"));
        assert!(ok);
        assert_eq!(client.get_fund_balance(), 700u128);
    }
}
