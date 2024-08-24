#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod state;
pub mod instructions;

use instructions::*;

declare_id!("9K1vk2VqZPW8g58Tq3N2VeMTXk4Ww9XsRqxSitLeT118");

#[program]
pub mod presale {
    use super::*;

    pub fn init_sale(ctx: Context<InitializeSale>, settings: Settings) -> Result<()> {
        sale::handle::create(ctx, settings)
    }
}