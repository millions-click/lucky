use crate::state::{
    game::Game,
    game_mode::GameMode,
    round::Round,
};
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Player {
    pub game: Pubkey,           // Each player will have a game account per game.

    pub rounds: u32,            // Number of rounds played.
    pub last_round: [u32; 16],  // Last round values.
    pub winning_count: u32,     // Number of rounds won.
    pub winner: bool,           // If the last round was won.
}

impl Player {
    pub fn new(game: Pubkey) -> Self {
        Self {
            game,
            rounds: 0,
            last_round: [0; 16],
            winning_count: 0,
            winner: false,
        }
    }

    pub fn play(&mut self, _game: &Game, mode: &GameMode, player_round: Round) -> Result<bool> {
        let nonce = self.rounds + 1;
        let round = player_round.generate_round(nonce, mode, &mode.game)?;
        let winner_choice = if mode.pick_winner { player_round.choices } else { [mode.winner_choice; 16] };
        let winner = self.check_winner(&round, mode, winner_choice);

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

    fn check_winner(&self, round: &[u32; 16], mode: &GameMode, winner_choice: [u32; 16]) -> bool {
        let mut winner = true;

        (0..mode.slots).for_each(|slot| {
            if winner_choice[slot as usize] != (round[slot as usize] % mode.choices) + 1 {
                winner = false;
            }
        });

        winner
    }
}