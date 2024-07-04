use crate::state::{
    game::Game,
    game_mode::GameMode,
    round::Round,
};
use anchor_lang::prelude::*;
use crate::constants::{MAX_SLOTS};

#[account]
#[derive(InitSpace)]
pub struct Player {
    pub game: Pubkey,                           // Each player will have a game account per game.

    pub rounds: u32,                            // Number of rounds played.

    #[max_len(MAX_SLOTS as usize)]
    pub last_round: Vec<u32>,                      // Last round values.
    pub winning_count: u32,                     // Number of rounds won.
    pub winner: bool,                           // If the last round was won.
}

impl Player {
    pub fn new(game: Pubkey) -> Self {
        Self {
            game,
            rounds: 0,
            last_round: Vec::new(),
            winning_count: 0,
            winner: false,
        }
    }

    pub fn play(&mut self, game: &Game, mode: &GameMode, player_round: Round) -> Result<bool> {
        let nonce = self.rounds + 1;
        let round = player_round.generate_round(nonce, mode, &mode.game)?;
        let winner_choice = if mode.pick_winner { player_round.choices } else { vec![mode.winner_choice; mode.slots as usize] };
        let winner = game.play_round(mode, &round, winner_choice)?;

        self.last_round = round;
        self.add_round();
        self.set_winner(winner);

        Ok(winner)
    }

    fn set_winner(&mut self, winner: bool) {
        self.winner = winner;
        if winner { self.winning_count = self.winning_count.checked_add(1).unwrap(); }
    }

    fn add_round(&mut self) {
        self.rounds += 1;
    }
}