use crate::instructions::Play;
use crate::constants::{ESCROW_SEED};
use anchor_lang::prelude::*;
use anchor_spl::token::{Transfer};

pub fn reward(ctx: Context<Play>) -> Result<()> {
    let amount = ctx.accounts.bounty.claim_reward();

    let transfer_instruction = Transfer {
        from: ctx.accounts.vault.to_account_info(),
        to: ctx.accounts.bag.to_account_info(),
        authority: ctx.accounts.escrow.to_account_info(),
    };

    let bump = ctx.bumps.escrow;
    let seeds = &[ESCROW_SEED.as_ref(), &[bump]];
    let signer = &[&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
        signer,
    );

    anchor_spl::token::transfer(cpi_ctx, amount)?;

    let event = WinnerEvent {
        player: ctx.accounts.owner.key().clone(),
        realm: ctx.accounts.game.key().clone(),
        game: ctx.accounts.mode.key().clone(),
        gem: ctx.accounts.bounty.gem.key().clone(),
        amount,
    };

    emit!(event); // To subscribe and display winners in real-time
    emit_cpi!(event); // To create a reliable record of winners. Leaderboard.

    Ok(())
}

#[event]
pub struct WinnerEvent {
    player: Pubkey,
    realm: Pubkey,
    game: Pubkey,
    gem: Pubkey,
    amount: u64,
}