use crate::state::store::{Decimal, Store};
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

    pub payer: Signer<'info>,
    pub receiver: Account<'info, TokenAccount>,

    pub feed: AccountInfo<'info>,
    pub chainlink_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl Sale<'_>  {
    pub fn charge(&self, amount: u64) -> Result<()> {
        let feed = get_feed(
            self.chainlink_program.to_account_info(),
            self.feed.to_account_info(),
        )?;
        let tokens = Decimal::new(amount as i128, u32::from(self.trader.decimals));
        let price = self.store.get_price(feed, tokens);

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

    pub fn transfer(&self, amount: u64) -> Result<()> {
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

        anchor_spl::token::transfer(cpi_ctx, amount)?;

        Ok(())
    }
}