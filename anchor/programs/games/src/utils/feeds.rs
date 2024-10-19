use crate::state::store::Decimal;
use anchor_lang::prelude::*;
use chainlink_solana as chainlink;

pub fn get_feed<'a>(chainlink_program: AccountInfo<'a>, feed: AccountInfo<'a>) -> Result<Decimal> {
    let round = chainlink::latest_round_data(
        chainlink_program.to_account_info(),
        feed.to_account_info(),
    )?;

    let decimals = chainlink::decimals(
        chainlink_program.to_account_info(),
        feed.to_account_info(),
    )?;

    let description = chainlink::description(
        chainlink_program.to_account_info(),
        feed.to_account_info(),
    )?;

    let decimal_print = Decimal::new(round.answer, u32::from(decimals));
    msg!("{} price is {}", description, decimal_print);

    Ok(Decimal::new(round.answer, u32::from(decimals)))
}