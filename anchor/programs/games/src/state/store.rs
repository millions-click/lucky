use anchor_lang::prelude::*;

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
}