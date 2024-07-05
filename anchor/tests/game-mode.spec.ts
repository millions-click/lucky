import * as anchor from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';

import {
  encodeName,
  getGameModePDA,
  getGamePDA,
  getGamesProgram,
  MAX_DIGITS,
  MAX_SLOTS,
  MIN_CHOICES,
  MIN_DIGITS,
  MIN_SLOTS,
} from '../src/games-exports';

describe('Game Mode', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = getGamesProgram(provider);

  type GameMode = Omit<
    ReturnType<typeof program.account.gameMode.fetch> extends Promise<infer T>
      ? T
      : never,
    'game'
  >;

  const { payer: gamesKeypair } = payer;
  const secret = Keypair.generate();
  const gamePDA = getGamePDA(gamesKeypair.publicKey, secret.publicKey);
  const max = (digits: number) => Math.pow(10, digits) - 1;

  beforeAll(async () => {
    const name = encodeName('Awesome Game Modes');

    await program.methods
      .createGame(name)
      .accounts({ secret: secret.publicKey })
      .signers([gamesKeypair])
      .rpc();
  });

  describe('Valid Settings', () => {
    const VALID_GAMES: GameMode[] = [
      {
        slots: MIN_SLOTS,
        digits: MIN_DIGITS,
        choices: MIN_CHOICES,
        winnerChoice: 1,
        pickWinner: true,
      },
      {
        slots: MIN_SLOTS,
        digits: MAX_DIGITS,
        choices: max(MAX_DIGITS),
        winnerChoice: max(MAX_DIGITS),
        pickWinner: false,
      },
      {
        slots: MAX_SLOTS,
        digits: MIN_DIGITS,
        choices: MIN_CHOICES,
        winnerChoice: 0,
        pickWinner: false,
      },
      {
        slots: MAX_SLOTS,
        digits: MIN_DIGITS,
        choices: MIN_CHOICES,
        winnerChoice: 1,
        pickWinner: true,
      },
      {
        slots: MAX_SLOTS,
        digits: MAX_DIGITS,
        choices: max(MAX_DIGITS),
        winnerChoice: 0,
        pickWinner: false,
      },
      {
        slots: MAX_SLOTS,
        digits: MAX_DIGITS,
        choices: max(MAX_DIGITS),
        winnerChoice: max(MAX_DIGITS),
        pickWinner: true,
      },
    ];
    const INVALID_GAME: GameMode = {
      slots: MIN_SLOTS,
      digits: MIN_DIGITS,
      choices: MIN_CHOICES,
      winnerChoice: 0, // not allowed when slots == 1
      pickWinner: false,
    };

    VALID_GAMES.forEach((settings, i) => {
      describe(`Game with ${JSON.stringify(settings)}`, () => {
        const seed = `game-${i}`;
        const gameModePDA = getGameModePDA(gamePDA, seed);

        it(`Should initialize the game with the correct settings`, async () => {
          await program.methods
            .addGameMode(seed, { ...settings })
            .accounts({ secret: secret.publicKey })
            .signers([gamesKeypair])
            .rpc();

          const gameMode = await program.account.gameMode.fetch(gameModePDA);

          expect(gameMode.game).toEqual(gamePDA);
          expect(gameMode.slots).toEqual(settings.slots);
          expect(gameMode.digits).toEqual(settings.digits);
          expect(gameMode.choices).toEqual(settings.choices);
          expect(gameMode.winnerChoice).toEqual(settings.winnerChoice);
          expect(gameMode.pickWinner).toEqual(settings.pickWinner);
        });

        if (i < VALID_GAMES.length - 1)
          it(`Should update the game settings`, async () => {
            const newSettings = VALID_GAMES[i + 1];

            await program.methods
              .updateGameMode(seed, { ...newSettings })
              .accounts({ secret: secret.publicKey })
              .rpc();

            const gameMode = await program.account.gameMode.fetch(gameModePDA);

            expect(gameMode.slots).toEqual(newSettings.slots);
            expect(gameMode.digits).toEqual(newSettings.digits);
            expect(gameMode.choices).toEqual(newSettings.choices);
            expect(gameMode.winnerChoice).toEqual(newSettings.winnerChoice);
            expect(gameMode.pickWinner).toEqual(newSettings.pickWinner);
          });
        else
          it(`Should fail to update the game settings`, async () => {
            await expect(
              program.methods
                .updateGameMode(seed, { ...INVALID_GAME })
                .accounts({ secret: secret.publicKey })
                .rpc()
            ).rejects.toThrow();
          });

        it('Should close the game account', async () => {
          await program.methods
            .closeGameMode(seed)
            .accounts({ secret: secret.publicKey })
            .rpc();

          // The account should no longer exist, returning null.
          const gameMode = await program.account.gameMode.fetchNullable(
            gameModePDA
          );
          expect(gameMode).toBeNull();
        });
      });
    });
  });

  describe('Invalid Settings', () => {
    // Invalid game set tests. The goal is to reach all the branches of the verify function.
    const INVALID_GAMES: Array<GameMode & { reason: string }> = [
      {
        slots: MIN_SLOTS - 1,
        digits: MIN_DIGITS,
        choices: MIN_CHOICES,
        winnerChoice: 1,
        pickWinner: false,
        reason: `Slots < ${MIN_SLOTS}`,
      },
      {
        slots: MAX_SLOTS + 1,
        digits: MIN_DIGITS,
        choices: MIN_CHOICES,
        winnerChoice: 1,
        pickWinner: false,
        reason: `Slots > ${MAX_SLOTS}`,
      },
      {
        slots: MIN_SLOTS,
        digits: MIN_DIGITS - 1,
        choices: MIN_CHOICES,
        winnerChoice: 1,
        pickWinner: false,
        reason: `Digits < ${MIN_DIGITS}`,
      },
      {
        slots: MIN_SLOTS,
        digits: MAX_DIGITS + 1,
        choices: MIN_CHOICES,
        winnerChoice: 1,
        pickWinner: false,
        reason: `Digits > ${MAX_DIGITS}`,
      },
      {
        slots: MIN_SLOTS,
        digits: MIN_DIGITS,
        choices: MIN_CHOICES - 1,
        winnerChoice: 1,
        pickWinner: false,
        reason: `Choices < ${MIN_CHOICES}`,
      },
      {
        slots: MIN_SLOTS,
        digits: MIN_DIGITS,
        choices: max(MIN_CHOICES) + 1,
        winnerChoice: 1,
        pickWinner: false,
        reason: `Choices(MIN) > (10 ^ digits) - 1`,
      },
      {
        slots: MIN_SLOTS,
        digits: MAX_DIGITS,
        choices: max(MAX_DIGITS) + 1,
        winnerChoice: 1,
        pickWinner: false,
        reason: 'Choices(MAX) > (10 ^ digits) - 1',
      },
      {
        slots: MIN_SLOTS,
        digits: MIN_DIGITS,
        choices: MIN_CHOICES,
        winnerChoice: 0,
        pickWinner: false,
        reason: 'Winner choice 0 on single slot game',
      },
      {
        slots: MIN_SLOTS,
        digits: MIN_DIGITS,
        choices: max(MIN_DIGITS),
        winnerChoice: max(MIN_DIGITS) + 1,
        pickWinner: false,
        reason: 'single => Winner choice > choices | MIN',
      },
      {
        slots: 2,
        digits: MIN_DIGITS,
        choices: MIN_CHOICES,
        winnerChoice: MIN_CHOICES + 1,
        pickWinner: false,
        reason: 'multi => Winner choice > choices | MIN',
      },
      {
        slots: MIN_SLOTS,
        digits: MAX_DIGITS,
        choices: max(MAX_DIGITS),
        winnerChoice: max(MAX_DIGITS) + 1,
        pickWinner: false,
        reason: 'single => Winner choice > choices | MAX',
      },
      {
        slots: 2,
        digits: MIN_DIGITS,
        choices: MIN_CHOICES,
        winnerChoice: -1,
        pickWinner: false,
        reason: 'Winner choice < 0',
      },
      {
        slots: 2,
        digits: MIN_DIGITS,
        choices: MIN_CHOICES,
        winnerChoice: 0,
        pickWinner: true,
        reason: 'Pick winner true on winner choice 0',
      },
    ];

    INVALID_GAMES.forEach(({ reason, ...settings }, i) => {
      describe(reason, () => {
        const seed = `game-${i}`;

        it(`Should fail to initialize the game with the invalid settings`, async () => {
          await expect(
            program.methods
              .addGameMode(seed, { ...settings })
              .accounts({ secret: secret.publicKey })
              .signers([gamesKeypair])
              .rpc()
          ).rejects.toThrow();
        });
      });
    });
  });
});
