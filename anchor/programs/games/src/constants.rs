// ----------------------------- Treasure -----------------------------
pub const KEEPER_SEED: &[u8] = b"TREASURE_KEEPER";
pub const ESCROW_SEED: &[u8] = b"TREASURE_ESCROW";
pub const VAULT_SEED: &[u8] = b"TREASURE_VAULT";
pub const COLLECTOR_SEED: &[u8] = b"TOLLKEEPER";
pub const TREASURE_SEED: &[u8] = b"TREASURE";
pub const STORE_SEED: &[u8] = b"STORE";
pub const TREASURE_FORGE_COST: u64 = 25; // 25 SOL
pub const TRADER_LAUNCH_COST: u64 = 50; // 50 SOL

// ----------------------------- Game -----------------------------
pub const GAME_SEED: &[u8] = b"LUCKY_GAME";
pub const GAME_NAME_MIN_LEN: usize = 3;
pub const GAME_NAME_MAX_LEN: usize = 32;

// ----------------------------- GameMode -----------------------------
pub const GAME_MODE_SEED: &[u8] = b"GAME_MODE";
pub const MIN_SLOTS: u8 = 1;
pub const MAX_SLOTS: u8 = 10;
pub const MIN_DIGITS: u8 = 1;
pub const MAX_DIGITS: u8 = 8;
pub const MIN_CHOICES: u32 = 2;
pub type SLOTS = Vec<u32>;

// ----------------------------- Bounty -----------------------------
pub const BOUNTY_SEED: &[u8] = b"BOUNTY";
pub const RENEW_THRESHOLD: u64 = 10; // 10% of the last issued bounty.

// ----------------------------- Player -----------------------------
pub const PLAYER_SEED: &[u8] = b"LUCKY_PLAYER";