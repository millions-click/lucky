import Link from 'next/link';

export const asLink = (href: string) => ({
  next: '',
  Component: Link,
  props: { href },
  onClick: () => void 0,
});
