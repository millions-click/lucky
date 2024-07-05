pub fn shuffle(value: u64) -> u64 {
    let mut numbers = value.to_string().chars().map(|c| c.to_digit(10).unwrap() as u64).collect::<Vec<u64>>();
    let mut shuffled = Vec::new();

    while !numbers.is_empty() {
        let l = numbers.len() - 1;
        let index = numbers[l] % numbers.len() as u64;
        shuffled.push(numbers.remove(index as usize));
    }

    return shuffled.iter().fold(0, |acc, &x| acc * 10 + x);
}

pub fn shift(seed: u64) -> u64 {
    let mut x = seed;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    x
}

pub fn shuffled_shift(seed: u64, shifter: u8) -> u64 { shuffle(shift(seed ^ shifter as u64)) }
