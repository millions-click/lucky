pub use crate::state::{game_mode::GameMode, bounty::Bounty};
use crate::constants::{BOUNTY_SEED};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint};

pub fn new_bounty(bounty: &mut Bounty, settings: Bounty) -> Result<()> {
    bounty.price = settings.price.clone();
    bounty.reward = settings.reward.clone();
    // TODO: Verify it's a valid chainlink data feed.
    bounty.merchandise = settings.merchandise.clone();

    Ok(())
}

#[derive(Accounts)]
pub struct InitializeBounty<'info> {
    #[account(
        init_if_needed,
        payer = supplier,
        seeds = [BOUNTY_SEED, gem.key().as_ref(), task.key().as_ref()],
        bump,
        space = 8 + Bounty::INIT_SPACE
    )]
    pub bounty: Account<'info, Bounty>,

    pub task: Account<'info, GameMode>,
    pub gem: Account<'info, Mint>,

    #[account(mut)]
    supplier: Signer<'info>,
    system_program: Program<'info, System>,
}
