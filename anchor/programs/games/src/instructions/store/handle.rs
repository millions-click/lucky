pub use crate::state::{
    treasure::Treasure,
    store::{Store, StoreSettings, StorePackage, StorePackageSettings},
};
use crate::errors::TreasureErrorCode;
use crate::constants::{TREASURE_SEED, STORE_SEED, COLLECTOR_SEED};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

pub fn vendor(ctx: Context<InitializeStore>, settings: StoreSettings) -> Result<()> {
    let store = &mut ctx.accounts.store;

    store.set_price(settings.price.clone());
    store.set_trader(ctx.accounts.trader.key());
    store.set_feed(ctx.accounts.feed.key());

    Ok(())
}

pub fn set_package(ctx: Context<InitializeStorePackage>, amount: u64, settings: StorePackageSettings) -> Result<()> {
    ctx.accounts.package.init(amount, settings);
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeStore<'info> {
    pub trader: Account<'info, Mint>,
    /// CHECK: This is the chainlink feed account, to get the latest price rate.
    pub feed: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = authority,
        seeds = [STORE_SEED, trader.key().as_ref(), feed.key().as_ref()],
        bump,
        space = 8 + Store::INIT_SPACE
    )]
    pub store: Account<'info, Store>,

    // To prevent charging an unknown token.
    #[account(
        seeds = [COLLECTOR_SEED, trader.key().as_ref()],
        token::mint = trader,
        bump
    )]
    collector: Account<'info, TokenAccount>,

    #[account(
        has_one = authority @ TreasureErrorCode::InvalidAuthority,
        seeds = [TREASURE_SEED],
        bump,
    )]
    treasure: Account<'info, Treasure>,

    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: String)]
pub struct InitializeStorePackage<'info> {
    #[account(mut)]
    store: Account<'info, Store>,

    #[account(
        init,
        payer = authority,
        seeds = [STORE_SEED, store.key().as_ref(), amount.as_ref()],
        bump,
        space = 8 + StorePackage::INIT_SPACE
    )]
    package: Account<'info, StorePackage>,

    #[account(
        has_one = authority @ TreasureErrorCode::InvalidAuthority,
        seeds = [TREASURE_SEED],
        bump,
    )]
    treasure: Account<'info, Treasure>,

    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}
