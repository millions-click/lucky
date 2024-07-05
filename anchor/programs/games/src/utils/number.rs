pub fn find_range(digits: u8) -> (u64, u64) {
    let min = 10u64.pow(digits as u32 - 1);
    let max = 10u64.pow(digits as u32);

    (min, max)
}

pub fn range_it(value: u32, max: u32) -> u32 {
    if value <= max { return value; }
    max - (value % max)
}
pub fn range(value: u64, digits: u8) -> u32 {
    let (min, max) = find_range(digits);
    if value >= min && value < max { return value as u32; }

    (min + (value % (max - min))) as u32
}

pub fn split_value(value: u32, size: usize) -> Vec<u32> {
    let mut digits = value.to_string().chars().map(|c| c.to_digit(10).unwrap() as u32).collect::<Vec<u32>>();
    if digits.len() % size != 0 { panic!("Invalid chunk size"); }

    let mut parts = Vec::new();
    while !digits.is_empty() {
        let chunk = digits.drain(0..size).collect::<Vec<u32>>();
        let number = chunk.iter().fold(0, |acc, &x| acc * 10 + x);
        parts.push(number);
    }

    return parts;
}