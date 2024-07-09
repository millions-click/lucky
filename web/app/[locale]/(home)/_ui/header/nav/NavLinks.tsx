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
    image: '/assets/images/roadmap.webp',
    content:
      'Our roadmap is a visual representation of our journey to success.',
  },
  {
    id: 'buy',
    href: '/buy',
    label: 'Buy',
    title: 'Buy',
    image: '/assets/images/buy.webp',
    content: 'Buy our token and join the community.',
  },
  {
    id: 'tokenomics',
    href: '/tokenomics',
    label: 'Tokenomics',
    title: 'Tokenomics',
    image: '/assets/images/tokenomics.webp',
    content: 'Learn about our tokenomics and how it works.',
  },
  {
    id: 'team',
    href: '/team',
    label: 'Team',
    title: 'Team',
    image: '/assets/images/team.webp',
    content: 'Meet the team behind the project.',
  },
  {
    id: 'contact',
    href: '/contact',
    label: 'Contact',
    title: 'Contact',
    image: '/assets/images/contact.webp',
    content: 'Get in touch with us.',
  },
  {
    id: 'whitepaper',
    href: '/whitepaper',
    label: 'Whitepaper',
    title: 'Whitepaper',
    image: '/assets/images/whitepaper.webp',
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
