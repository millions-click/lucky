import { NavLink } from './NavLink';

type LinkItem = {
  id: string;
  href: string;
  label: string;
  title: string;
  image: string;
  content: string;
};
const items = [
  {
    id: 'roadmap',
    href: '/roadmap',
    label: 'Roadmap',
    title: 'Roadmap',
    image: '/assets/images/pages/roadmap.png',
    content:
      'Our roadmap is a visual representation of our journey to success.',
  },
  {
    id: 'leaderboard',
    href: '/leaderboard',
    label: 'Leaderboard',
    title: 'Leaderboard',
    image: '/assets/images/pages/leaderboard.png',
    content: 'See the top players and their scores.',
  },
  {
    id: 'buy',
    href: '/buy',
    label: 'Buy',
    title: 'Buy',
    image: '/assets/images/pages/buy.png',
    content: 'Buy our token and join the community.',
  },
  {
    id: 'tokenomics',
    href: '/tokenomics',
    label: 'Tokenomics',
    title: 'Tokenomics',
    image: '/assets/images/pages/tokenomics.png',
    content: 'Learn about our tokenomics and how it works.',
  },
  {
    id: 'about',
    href: '/about',
    label: 'About Us',
    title: 'About Us',
    image: '/assets/images/pages/about.png',
    content: 'Learn more about our project and what we do.',
  },
  {
    id: 'whitepaper',
    href: '/whitepaper',
    label: 'Whitepaper',
    title: 'Whitepaper',
    image: '/assets/images/pages/whitepaper.png',
    content: 'Read our whitepaper to learn more about the project.',
  },
] as Array<LinkItem>;

export const NavLinks = async () => {
  return (
    <>
      {items.map((item, i) => (
        <NavLink key={i} {...item}>
          {item.label}
        </NavLink>
      ))}
    </>
  );
};
