pub use crate::state::sale::Sale;
use crate::errors::SaleErrorCode;
use crate::constants::{SALE_SEED};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint};

pub fn withdraw(ctx: &Context<SaleWithdraw>, amount: u64) -> Result<()> {
    let balance = ctx.accounts.sale.get_lamports();
    let rent = ctx.accounts.rent.minimum_balance(8 + Sale::INIT_SPACE);
    if balance - amount < rent { return Err(SaleErrorCode::InsufficientBalance.into()); }

    let lamports = if amount == 0 { balance - rent } else { amount };
    if lamports == 0 { return Ok(()); }

    ctx.accounts.sale.sub_lamports(lamports)?;
    ctx.accounts.owner.add_lamports(lamports)?;

    Ok(())
}

#[derive(Accounts)]
pub struct SaleWithdraw<'info> {
    #[account(
        mut,
        has_one = owner @ SaleErrorCode::InvalidAuthority,
        seeds = [SALE_SEED, token.key().as_ref()],
        bump,
    )]
    sale: Account<'info, Sale>,

    #[account(mut)]
    owner: Signer<'info>,
    token: Account<'info, Mint>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}