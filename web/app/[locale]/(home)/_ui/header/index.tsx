import { Nav } from './nav';

export function Header() {
  return (
    <header className="fixed flex justify-between left-0 top-0 right-0 px-4 lg:px-8 py-4 z-10">
      <Nav />
      <button className="btn btn-square btn-ghost">Log in</button>
    </header>
  );
}
