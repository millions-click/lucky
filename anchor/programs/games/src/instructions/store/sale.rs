use crate::state::store::{Decimal, Store};
use crate::constants::{COLLECTOR_SEED, STORE_SEED};
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer};
use chainlink_solana as chainlink;

fn get_feed(ctx: &Context<StoreSale>) -> Result<Decimal> {
    let round = chainlink::latest_round_data(
        ctx.accounts.chainlink_program.to_account_info(),
        ctx.accounts.feed.to_account_info(),
    )?;

    let decimals = chainlink::decimals(
        ctx.accounts.chainlink_program.to_account_info(),
        ctx.accounts.feed.to_account_info(),
    )?;

    let description = chainlink::description(
        ctx.accounts.chainlink_program.to_account_info(),
        ctx.accounts.feed.to_account_info(),
    )?;

    let decimal_print = Decimal::new(round.answer, u32::from(decimals));
    msg!("{} price is {}", description, decimal_print);

    Ok(Decimal::new(round.answer, u32::from(decimals)))
}

fn charge(ctx: &Context<StoreSale>, amount: u64) -> Result<()> {
    let feed = get_feed(ctx)?;
    let tokens = Decimal::new(amount as i128, u32::from(ctx.accounts.trader.decimals));
    let price = ctx.accounts.store.get_price(feed, tokens);

    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.payer.to_account_info(),
            to: ctx.accounts.store.to_account_info(),
        },
    );

    system_program::transfer(cpi_context, price)?;

    Ok(())
}

fn transfer(ctx: &Context<StoreSale>, amount: u64) -> Result<()> {
    let transfer_instruction = Transfer {
        from: ctx.accounts.collector.to_account_info(),
        to: ctx.accounts.receiver.to_account_info(),
        authority: ctx.accounts.tollkeeper.to_account_info(),
    };

    let bump = ctx.bumps.tollkeeper;
    let seeds = &[COLLECTOR_SEED.as_ref(), &[bump]];
    let signer = &[&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
        signer,
    );

    anchor_spl::token::transfer(cpi_ctx, amount)?;

    Ok(())
}

pub fn trader(ctx: &Context<StoreSale>, amount: u64) -> Result<()> {
    charge(ctx, amount)?;
    transfer(ctx, amount)?;

    Ok(())
}

#[derive(Accounts)]
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

    #[account(mut)]
    payer: Signer<'info>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
}