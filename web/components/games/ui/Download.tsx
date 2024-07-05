import { useGamesProgram, usePlayer, useTreasureProgram } from '@/hooks';
import { IconWorldDownload } from '@tabler/icons-react';
import { useGames } from '@/app/games/_provider/games-provider';

export function DownloadGamesTree() {
  const { owner } = usePlayer();
  const { getGame, getMode } = useGames();
  const { treasure } = useTreasureProgram();
  const { games, programId } = useGamesProgram();

  if (!treasure.data?.authority.equals(owner)) return null;

  const downloadGames = () => {
    if (!games.data) return;

    const raw = {
      programId,
      games: Object.fromEntries(
        games.data.map((_game) => {
          const { publicKey: gamePDA, account: game } = _game;
          const { modes: __, ...seeds } = getGame(gamePDA);

          const modes = Object.fromEntries(
            _game.modes.map((_mode) => {
              const { publicKey: modePDA, account: mode } = _mode;
              const { mode: seed } = getMode(gamePDA, modePDA);

              const bounties = Object.fromEntries(
                _mode.bounties.map((_bounty) => {
                  const { publicKey: bountyPDA, account: bounty } = _bounty;
                  return [
                    bountyPDA.toString(),
                    {
                      seeds: {
                        task: bounty.task,
                        gem: bounty.gem,
                        trader: bounty.trader,
                      },
                      bounty,
                    },
                  ];
                })
              );

              return [
                modePDA.toString(),
                {
                  seeds: {
                    game: gamePDA,
                    seed,
                  },
                  mode,
                  bounties,
                },
              ];
            })
          );

          return [
            gamePDA.toString(),
            {
              seeds,
              game,
              modes,
            },
          ];
        })
      ),
    };

    const blob = new Blob([JSON.stringify(raw)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
  };

  return (
    <button
      className="btn btn-ghost"
      disabled={!games.data?.length}
      onClick={downloadGames}
    >
      <IconWorldDownload />
    </button>
  );
}
