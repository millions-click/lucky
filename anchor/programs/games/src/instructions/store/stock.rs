use crate::constants::{COLLECTOR_SEED};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer};

pub fn fill(ctx: &Context<StoreStockFill>, amount: u64) -> Result<()> {
    let transfer_instruction = Transfer {
        from: ctx.accounts.reserve.to_account_info(),
        to: ctx.accounts.collector.to_account_info(),
        authority: ctx.accounts.supplier.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
    );

    anchor_spl::token::transfer(cpi_ctx, amount)?;

    Ok(())
}


#[derive(Accounts)]
pub struct StoreStockFill<'info> {
    #[account(
        mut,
        seeds = [COLLECTOR_SEED, trader.key().as_ref()],
        bump
    )]
    collector: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = trader
    )]
    reserve: Account<'info, TokenAccount>,
    trader: Account<'info, Mint>,

    #[account(mut)]
    supplier: Signer<'info>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
}