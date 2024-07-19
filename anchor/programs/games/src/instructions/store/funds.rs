use crate::state::{
    treasure::Treasure,
    store::Store,
};
use crate::errors::{StoreErrorCode, TreasureErrorCode};
use crate::constants::TREASURE_SEED;
use anchor_lang::prelude::*;

pub fn withdraw(ctx: &Context<StoreWithdraw>, amount: u64) -> Result<()> {
    let balance = ctx.accounts.store.get_lamports();
    let rent = ctx.accounts.rent.minimum_balance(8 + Store::INIT_SPACE);
    if balance - amount < rent { return Err(StoreErrorCode::InsufficientBalance.into()); }

    let lamports = if amount == 0 { balance - rent } else { amount };
    if lamports == 0 { return Ok(()); }

    ctx.accounts.store.sub_lamports(lamports)?;
    ctx.accounts.authority.add_lamports(lamports)?;

    Ok(())
}

#[derive(Accounts)]
pub struct StoreWithdraw<'info> {
    #[account(mut)]
    store: Account<'info, Store>,

    #[account(
        has_one = authority @ TreasureErrorCode::InvalidAuthority,
        seeds = [TREASURE_SEED],
        bump,
    )]
    treasure: Account<'info, Treasure>,

    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}
