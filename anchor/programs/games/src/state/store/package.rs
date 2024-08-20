use crate::state::store::{Decimal};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct StorePackageSettings {
    price: i128,
    sales: u32,
}

#[account]
#[derive(InitSpace)]
pub struct StorePackage {
    price: i128, // The price of the token in feed's quote currency. (used for store promos)
    amount: u64, // The amount of tokens in the package.

    sales: u32, // The number of sales for this package.
    max: u32, // The maximum number of sales for this package.
}

impl StorePackage {
    pub fn new(price: i128, amount: u64, sales: u32) -> Result<Self> {
        let package = Self {
            price,
            amount,
            sales: 0,
            max: sales,
        };

        Ok(package)
    }

    pub fn init(&mut self, amount: u64, settings: StorePackageSettings) {
        self.price = settings.price;
        self.amount = amount;
        self.sales = 0;
        self.max = settings.sales;
    }

    pub fn get_amount(&self, decimals: u8) -> Decimal {
        Decimal::new(self.amount as i128, u32::from(decimals))
    }

    pub fn raw_amount(&self) -> u64 {
        self.amount
    }

    pub fn get_price(&self) -> i128 {
        if self.sales >= self.max { return 0 }
        return self.price;
    }

    pub fn increment_sales(&mut self) {
        self.sales += 1
    }
}