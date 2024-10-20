use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct StoreSettings {
    pub price: i128,
}

#[account]
#[derive(InitSpace)]
pub struct Store {
    pub trader: Pubkey, // The trader token mint.

    pub feed: Pubkey, // Chainlink Data Feed account. This is the source of rate data. (USD/SOL)
    pub price: i128, // The price of the token in feed's quote currency.
}

#[derive(Clone, Copy)]
pub struct Decimal {
    value: i128,
    decimals: u32,
}

impl Store {
    pub fn new(trader: Pubkey, feed: Pubkey, price: i128) -> Result<Self> {
        let store = Self {
            trader,
            feed,
            price,
        };

        Ok(store)
    }

    pub fn set_trader(&mut self, trader: Pubkey) {
        self.trader = trader;
    }

    pub fn set_feed(&mut self, feed: Pubkey) {
        self.feed = feed;
    }

    pub fn set_price(&mut self, price: i128) {
        self.price = price;
    }

    pub fn get_cost(&self, tokens: Decimal, pkg_price: i128, feed: Decimal) -> u64 {
        // scale the token amount to the same decimals as the rate if needed.
        let _price = if pkg_price > 0 { pkg_price } else { self.price };
        let (amount, normalized) = tokens.normalize(Decimal::new(_price, feed.decimals));
        let (rate, price) = feed.normalize(normalized);

        msg!("LS / USD: {}", price);
        msg!("LS: {}", amount);

        // Calculate the price per token
        let price_per_token = price.value * 10i128.pow(rate.decimals) / rate.value;

        // Calculate the total price for the amount of tokens
        let total_price = Decimal::new(price_per_token * amount.value, price.decimals);

        let one_sol = Decimal::new(LAMPORTS_PER_SOL as i128, 9);
        let (cost, _) = Decimal::new(total_price.reduce() as i128, price.decimals).normalize(one_sol);
        msg!("SOL: {}", cost);

        // Return the total price
        cost.value as u64
    }
}


impl Decimal {
    pub fn new(value: i128, decimals: u32) -> Self {
        Decimal { value, decimals }
    }

    fn scale(&self, decimals: u32) -> Decimal {
        let scaled = self.value * 10i128.pow(decimals - self.decimals);
        Decimal::new(scaled, decimals)
    }

    fn normalize(&self, value: Decimal) -> (Decimal, Decimal) {
        if self.decimals == value.decimals { return (self.clone(), value.clone()); }

        if self.decimals > value.decimals {
            (self.clone(), value.scale(self.decimals))
        } else {
            (self.scale(value.decimals), value.clone())
        }
    }

    fn reduce(&self) -> u64 { (self.value / 10i128.pow(self.decimals)) as u64 }
}

impl std::fmt::Display for Decimal {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut scaled_val = self.value.to_string();
        if scaled_val.len() <= self.decimals as usize {
            scaled_val.insert_str(
                0,
                &vec!["0"; self.decimals as usize - scaled_val.len()].join(""),
            );
            scaled_val.insert_str(0, "0.");
        } else {
            scaled_val.insert(scaled_val.len() - self.decimals as usize, '.');
        }
        f.write_str(&scaled_val)
    }
}
