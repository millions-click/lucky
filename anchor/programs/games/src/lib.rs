#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod utils;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("HCZ5KdroZ7BQrmkZq1a72t2FVVQuxqVjkR4ZmAvi8CTr");

#[program]
pub mod games {
    use super::*;

    // ------------------------ TREASURE ------------------------
    pub fn create_treasure(ctx: Context<BuildTreasure>) -> Result<()> {
        ctx.accounts.treasure.authority = ctx.accounts.authority.key();

        Ok(())
    }

    pub fn forge_stronghold(ctx: Context<InitializeTreasure>) -> Result<()> {
        treasure::forge::pay(&ctx)
    }

    pub fn launch_escrow(ctx: Context<LaunchTrader>) -> Result<()> {
        escrow::launch::pay_definition(&ctx)
    }

    pub fn launch_store(ctx: Context<InitializeStore>, settings: StoreSettings) -> Result<()> {
        store::handle::vendor(ctx, settings)
    }

    pub fn store_package(ctx: Context<InitializeStorePackage>, amount: String, settings: StorePackageSettings) -> Result<()> {
        let amount = amount.parse::<u64>().unwrap();
        store::handle::set_package(ctx, amount, settings)
    }

    pub fn stockpile_gems(ctx: Context<Stockpile>, amount: u64) -> Result<()> {
        treasure::stockpile::receive(&ctx, amount)
    }

    pub fn store_fill(ctx: Context<StoreStockFill>, amount: u64) -> Result<()> {
        store::stock::fill(&ctx, amount)
    }

    pub fn store_sale(ctx: Context<StoreSale>, _amount: String) -> Result<()> {
        store::sale::trader(ctx)
    }

    pub fn retrieve_gems(ctx: Context<UnlockStronghold>, amount: u64) -> Result<()> {
        treasure::unlock::acquire_loot(&ctx, amount)
    }

    pub fn store_withdraw(ctx: Context<StoreWithdraw>, amount: u64) -> Result<()> {
        store::funds::withdraw(&ctx, amount)
    }

    // ------------------------ GAME ------------------------
    pub fn create_game(ctx: Context<InitializeGame>, name: String) -> Result<()> {
        game::init::new_game(&mut ctx.accounts.game, &name)
    }

    pub fn update_game(ctx: Context<UpdateGame>, name: String) -> Result<()> {
        game::manage::update_game(&mut ctx.accounts.game, &name)
    }

    pub fn activate_game(ctx: Context<UpdateGame>) -> Result<()> {
        game::manage::activate_game(&mut ctx.accounts.game)
    }

    pub fn pause_game(ctx: Context<UpdateGame>) -> Result<()> {
        game::manage::pause_game(&mut ctx.accounts.game)
    }

    // TODO: As each bounty is tied to a game mode.
    //  we need to close all bounties associated with all game modes recursively.
    //      we must not allow ending a game if there are active bounties.
    //  currently, all bounties get orphaned.
    pub fn end_game(ctx: Context<UpdateGame>) -> Result<()> {
        game::manage::end_game(&mut ctx.accounts.game)
    }

    pub fn close_game(ctx: Context<CloseGame>) -> Result<()> {
        game::manage::delete_game(&mut ctx.accounts.game)
    }

    // ------------------------ GAME_MODE ------------------------
    pub fn add_game_mode(ctx: Context<InitializeGameMode>, _mode_seed: String, settings: GameModeSettings) -> Result<()> {
        ctx.accounts.mode.game = ctx.accounts.game.key();
        game_mode::upsert::verify_and_set(&mut ctx.accounts.mode, settings)
    }

    pub fn update_game_mode(ctx: Context<UpdateGameMode>, _mode_seed: String, settings: GameModeSettings) -> Result<()> {
        game_mode::upsert::verify_and_set(&mut ctx.accounts.mode, settings)
    }

    // TODO: As each bounty is tied to a game mode.
    //  we need to close all bounties associated with the game mode.
    //      we must not allow closing a game mode if there are active bounties.
    //  currently, all bounties get orphaned.
    pub fn close_game_mode(_ctx: Context<CloseGameMode>, _mode_seed: String) -> Result<()> { Ok(()) }

    // ------------------------ BOUNTY ------------------------
    pub fn issue_bounty(ctx: Context<InitializeBounty>, settings: BountySettings) -> Result<()> {
        ctx.accounts.bounty.owner = ctx.accounts.supplier.key();
        ctx.accounts.bounty.gem = ctx.accounts.gem.key();
        ctx.accounts.bounty.task = ctx.accounts.task.key();
        ctx.accounts.bounty.trader = ctx.accounts.trader.key();

        bounty::publish::new_bounty(&mut ctx.accounts.bounty, settings)
    }

    pub fn fund_bounty(ctx: Context<VaultLoad>, amount: u64) -> Result<()> {
        let available = bounty::fund::vault_load(&ctx, amount)?;
        bounty::fund::gems_issued(&mut ctx.accounts.bounty, available)?;

        Ok(())
    }

    pub fn renew_bounty(ctx: Context<RenewBounty>, settings: BountySettings) -> Result<()> {
        bounty::renew::existent_bounty(&mut ctx.accounts.bounty, settings)
    }

    // ------------------------ PLAYER ------------------------
    pub fn play_round(ctx: Context<Play>, round: Round) -> Result<()> {
        escrow::accept::payment(&ctx)?;
        let winner = player::game::play(&mut ctx.accounts.player, &ctx.accounts.game, &ctx.accounts.mode, round)?;
        if winner { escrow::redeem::reward(ctx)?; }

        Ok(())
    }
}
