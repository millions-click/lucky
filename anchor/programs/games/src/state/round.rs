use crate::state::game_mode::GameMode;
use crate::errors::RoundErrorCode;
use crate::constants::{MAX_DIGITS, MAX_SLOTS, SLOTS};
use crate::utils::{
    number::{range, split_value},
    rand::{shift, shuffled_shift},
    seeds::{now, signed_seed},
};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct Round {
    pub seed: u64,
    pub choices: SLOTS,
}

impl Round {
    pub fn new(seed: u64, choices: SLOTS) -> Self {
        Self {
            seed,
            choices,
        }
    }

    pub fn verify(&self, mode: &GameMode) -> Result<()> {
        Self::verify_seed(self.seed)?;
        if mode.pick_winner { Self::verify_choices(&self.choices, mode)? }

        Ok(())
    }

    fn verify_seed(seed: u64) -> Result<()> {
        if seed == 0 || seed.to_string().len() > MAX_DIGITS as usize { return Err(RoundErrorCode::InvalidSeed.into()); }
        Ok(())
    }

    fn verify_choices(choices: &SLOTS, mode: &GameMode) -> Result<()> {
        let slots = mode.slots;
        let total_choices = mode.choices;
        let winners = &choices[0..slots as usize];

        if winners.iter().any(|&choice| choice == 0 || choice > total_choices) { return Err(RoundErrorCode::InvalidChoice.into()); }
        Ok(())
    }

    pub fn generate_round(&self, nonce: u32, mode: &GameMode, signer: &Pubkey) -> Result<SLOTS> {
        let now = now()?;
        let mut seed = shift(signed_seed(now ^ self.seed ^ nonce as u64, signer));
        let shifters = split_value(range(seed, mode.slots), 1);

        let mut round = Vec::new();
        (0..mode.slots).for_each(|slot| {
            seed = shuffled_shift(range(seed, MAX_SLOTS) as u64, shifters[slot as usize] as u8);
            round.push(range(seed, mode.digits));
        });

        Ok(round)
    }
}