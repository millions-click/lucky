use crate::errors::GameErrorCode;
use crate::constants::{GAME_NAME_MAX_LEN, GAME_NAME_MIN_LEN};
use anchor_lang::prelude::*;

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameStatus {
    Created,
    Active,
    Paused,
    Ended,
}

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameType {
    SinglePlayer,
    MultiPlayer,
}

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameRound {
    Single,
    Multiple,
}

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameChoice {
    Single,
    Multiple,
}

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameAlgorithm {
    Random,
    Deterministic,
}

#[account]
#[derive(InitSpace)]
pub struct Game {
    #[max_len(GAME_NAME_MAX_LEN)]
    pub name: String,
    pub state: GameStatus,

    pub mode: GameType,
    pub round: GameRound,
    pub choice: GameChoice,
    pub algorithm: GameAlgorithm,
}

impl Game {
    pub fn new(name: &String) -> Result<Self> {
        let mut game = Self {
            name: String::new(),
            state: GameStatus::Created,

            mode: GameType::SinglePlayer,
            round: GameRound::Single,
            choice: GameChoice::Single,
            algorithm: GameAlgorithm::Random,
        };

        game.set_name(name)?;

        Ok(game)
    }

    pub fn set_name(&mut self, name: &String) -> Result<()> {
        Self::verify_name(name)?;
        self.name = name.clone();

        Ok(())
    }

    pub fn active(&self) -> bool {
        self.state == GameStatus::Active
    }

    pub fn paused(&self) -> bool {
        self.state == GameStatus::Paused
    }

    pub fn ended(&self) -> bool {
        self.state == GameStatus::Ended
    }

    pub fn created(&self) -> bool {
        self.state == GameStatus::Created
    }

    pub fn set_active(&mut self) -> Result<()> {
        if self.ended() { return Err(GameErrorCode::GameEnded.into()); }
        self.state = GameStatus::Active;

        Ok(())
    }

    pub fn set_paused(&mut self) -> Result<()> {
        if self.ended() { return Err(GameErrorCode::GameEnded.into()); }
        self.state = GameStatus::Paused;

        Ok(())
    }

    pub fn set_ended(&mut self) {
        self.state = GameStatus::Ended;
    }

    pub fn can_play(&self) -> Result<()> {
        if !self.active() { return Err(GameErrorCode::GameInactive.into()); }

        Ok(())
    }

    fn verify_name(name: &String) -> Result<()> {
        if name.len() < GAME_NAME_MIN_LEN { return Err(GameErrorCode::InvalidName.into()); }

        Ok(())
    }
}
