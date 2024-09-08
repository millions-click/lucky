'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function NavLink({
  href,
  title,
  image,
  content,
}: {
  href: string;
  title: string;
  image: string;
  content: string;
  children: JSX.Element | string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-label={title}
      className={[
        'card bg-base-100 image-full col-span-6 2xl:col-span-4 overflow-hidden group cursor-pointer transition-transform max-sm:card-compact',
        isActive ? 'shadow-glow-add' : 'shadow-xl hover:scale-105',
      ].join(' ')}
    >
      <figure className="w-full">
        <Image src={image} alt={title} fill={true} />
      </figure>
      <div
        className={`card-body sm:justify-center sm:items-center ${
          isActive ? '' : 'md:invisible group-hover:visible'
        }`}
      >
        <h2 className="card-title md:text-4xl tracking-tight">{title}</h2>
        <span className="whitespace-pre-wrap max-md:text-xs">{content}</span>
      </div>
    </Link>
  );
}
