use crate::state::store::Store;
use crate::constants::{COLLECTOR_SEED, STORE_SEED};
use crate::instructions::sale::utils::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::instructions::StorePackage;

pub fn trader(ctx: &Context<StoreSale>, amount: u64) -> Result<()> {
    let sale = Sale {
        tollkeeper: ctx.accounts.tollkeeper.clone(),
        bump: ctx.bumps.tollkeeper,
        collector: ctx.accounts.collector.clone(),
        trader: ctx.accounts.trader.clone(),
        store: ctx.accounts.store.clone(),
        payer: ctx.accounts.payer.clone(),
        receiver: ctx.accounts.receiver.clone(),
        feed: ctx.accounts.feed.clone(),
        chainlink_program: ctx.accounts.chainlink_program.clone(),
        system_program: ctx.accounts.system_program.clone(),
        token_program: ctx.accounts.token_program.clone(),
    };

    sale.charge(amount)?;
    sale.transfer(amount)?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(amount: String)]
pub struct StoreSale<'info> {
    /// CHECK: This is the collector keeper, Needs to sign for transfer.
    #[account(
        seeds = [COLLECTOR_SEED],
        bump,
    )]
    tollkeeper: AccountInfo<'info>,

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
    receiver: Account<'info, TokenAccount>,

    /// CHECK: This is the chainlink feed account, to get the latest price rate.
    feed: AccountInfo<'info>,
    /// CHECK: This is the Chainlink program library
    chainlink_program: AccountInfo<'info>,
    trader: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [STORE_SEED, trader.key().as_ref(), feed.key().as_ref()],
        bump,
    )]
    store: Account<'info, Store>,

    #[account(
        mut,
        seeds = [STORE_SEED, store.key().as_ref(), amount.as_ref()],
        bump,
    )]
    package: Account<'info, StorePackage>,

    #[account(mut)]
    payer: Signer<'info>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
}