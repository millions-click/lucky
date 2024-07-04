use crate::state::game_mode::GameMode;
use crate::errors::GameErrorCode;
use crate::constants::{GAME_NAME_MAX_LEN, GAME_NAME_MIN_LEN, SLOTS};
use crate::utils::number::range_it;
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

    pub fn play_round(&self, mode: &GameMode, round: &SLOTS, winner_choice: SLOTS) -> Result<bool> {
        self.mode.play_round(self, mode, round, winner_choice)
    }
}

impl GameType {
    pub fn play_round(&self, game: &Game, mode: &GameMode, round: &SLOTS, winner_choice: SLOTS) -> Result<bool> {
        match self {
            GameType::SinglePlayer => Self::single_player(game, mode, round, winner_choice),
            GameType::MultiPlayer => Self::multi_player(game, mode, round, winner_choice),
        }
    }

    fn single_player(game: &Game, mode: &GameMode, round: &SLOTS, winner_choice: SLOTS) -> Result<bool> {
        // Game => Single Player
        game.algorithm.play_round(game, mode, round, winner_choice)
    }

    fn multi_player(_game: &Game, _mode: &GameMode, _round: &SLOTS, _winner_choice: SLOTS) -> Result<bool> {
        return Err(GameErrorCode::Unimplemented.into());
    }
}

impl GameRound {
    pub fn play_round(&self, game: &Game, mode: &GameMode, round: &SLOTS, winner_choice: SLOTS) -> Result<bool> {
        match self {
            GameRound::Single => Self::single(game, mode, round, winner_choice),
            GameRound::Multiple => Self::multiple(game, mode, round, winner_choice),
        }
    }

    fn single(game: &Game, mode: &GameMode, round: &SLOTS, winner_choice: SLOTS) -> Result<bool> {
        // Game => Single Player > Random > Single Round
        game.choice.play_round(game, mode, round, winner_choice)
    }

    fn multiple(_game: &Game, _mode: &GameMode, _round: &SLOTS, _winner_choice: SLOTS) -> Result<bool> {
        return Err(GameErrorCode::Unimplemented.into());
    }
}

impl GameChoice {
    pub fn play_round(&self, game: &Game, mode: &GameMode, round: &SLOTS, winner_choice: SLOTS) -> Result<bool> {
        match self {
            GameChoice::Single => Self::single(game, mode, round, winner_choice),
            GameChoice::Multiple => Self::multiple(game, mode, round, winner_choice),
        }
    }

    fn single(_game: &Game, mode: &GameMode, round: &SLOTS, winner_choice: SLOTS) -> Result<bool> {
        // Game => Single Player > Random > Single Round > Single Choice
        msg!("🎰 Playing lucky game");
        msg!("⚙️ Game Settings | Single Player > Random > Single Round > Single Choice");
        msg!("🎰 Mode: slots: {}, digits: {}, choices: {}, winner_choice: {}, pick_winner: {}", mode.slots, mode.digits, mode.choices, mode.winner_choice, mode.pick_winner);
        msg!("🎰 Original Round: {:?}", round);

        let shoots = round.iter().map(|&choice| range_it(choice, mode.choices)).collect::<SLOTS>();

        msg!("🎰 Ranged Round: {:?}", shoots);
        msg!("🎰 Winner Choice: {:?}", winner_choice);

        let result = shoots.iter().fold(*shoots.first().unwrap_or(&0), |prev, &current| if prev == current { current } else { mode.choices + 1 });
        let winner = winner_choice[0];

        msg!("🎰 Result: {}, Winner: {}", result, winner);

        let is_winner = if result > mode.choices { false } else { winner == 0 || result == winner };

        msg!("🎰 Is Winner: {}", is_winner);

        Ok(is_winner)
    }

    fn multiple(_game: &Game, _mode: &GameMode, _round: &SLOTS, _winner_choice: SLOTS) -> Result<bool> {
        return Err(GameErrorCode::Unimplemented.into());
    }
}

impl GameAlgorithm {
    pub fn play_round(&self, game: &Game, mode: &GameMode, round: &SLOTS, winner_choice: SLOTS) -> Result<bool> {
        match self {
            GameAlgorithm::Random => Self::random(game, mode, round, winner_choice),
            GameAlgorithm::Deterministic => Self::deterministic(game, mode, round, winner_choice),
        }
    }

    fn random(game: &Game, mode: &GameMode, round: &SLOTS, winner_choice: SLOTS) -> Result<bool> {
        // Game => Single Player > Random
        game.round.play_round(game, mode, round, winner_choice)
    }

    fn deterministic(_game: &Game, _mode: &GameMode, _round: &SLOTS, _winner_choice: SLOTS) -> Result<bool> {
        return Err(GameErrorCode::Unimplemented.into());
    }
}