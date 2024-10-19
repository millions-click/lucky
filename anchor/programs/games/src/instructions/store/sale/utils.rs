use crate::state::store::{Store, StorePackage};
use crate::constants::{COLLECTOR_SEED};
use crate::utils::feeds::get_feed;
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer};

pub struct Sale<'info> {
    pub tollkeeper: AccountInfo<'info>,
    pub bump: u8,
    pub collector: Account<'info, TokenAccount>,
    pub trader: Account<'info, Mint>,
    pub store: Account<'info, Store>,
    pub package: Account<'info, StorePackage>,

    pub payer: Signer<'info>,
    pub receiver: Account<'info, TokenAccount>,

    pub feed: AccountInfo<'info>,
    pub chainlink_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl Sale<'_> {
    pub fn charge(&mut self) -> Result<()> {
        let feed = get_feed(
            self.chainlink_program.to_account_info(),
            self.feed.to_account_info(),
        )?;
        let tokens = self.package.get_amount(self.trader.decimals);
        let price = self.store.get_cost(tokens, self.package.get_price(), feed);

        let cpi_context = CpiContext::new(
            self.system_program.to_account_info(),
            system_program::Transfer {
                from: self.payer.to_account_info(),
                to: self.store.to_account_info(),
            },
        );

        system_program::transfer(cpi_context, price)?;

        Ok(())
    }

    pub fn transfer(&self) -> Result<()> {
        let transfer_instruction = Transfer {
            from: self.collector.to_account_info(),
            to: self.receiver.to_account_info(),
            authority: self.tollkeeper.to_account_info(),
        };

        let bump = self.bump;
        let seeds = &[COLLECTOR_SEED.as_ref(), &[bump]];
        let signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            transfer_instruction,
            signer,
        );

        anchor_spl::token::transfer(cpi_ctx, self.package.raw_amount())?;

        Ok(())
    }
}