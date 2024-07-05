import { settings, type Game, type Modes } from '../../assets/games';

export function loadGames() {
  const { games } = settings;
  return Object.entries(games).map(([pda, game]) => ({ pda, ...game }));
}

export { Game, Modes };
