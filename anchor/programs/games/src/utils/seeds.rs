use anchor_lang::prelude::*;

pub fn now() -> Result<u64> {
    let timestamp = Clock::get()?.unix_timestamp;
    if timestamp == 0 { return Err(ProgramError::InvalidArgument.into()); }

    // value: `9223372046`. This is the maximum timestamp that can be used as seed.
    // modify this before next 236 years to prevent overflow. xD
    if timestamp > 9223372046 { return Err(ProgramError::ArithmeticOverflow.into()); }

    Ok(timestamp as u64)
}

pub fn signed_seed(seed: u64, signer: &Pubkey) -> u64 {
    let mut seed = seed;
    for (i, k) in signer.to_bytes().iter().enumerate() {
        seed ^= (*k as u64) << i;
    }

    seed
}