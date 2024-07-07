'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function NavLink({
  href,
  title,
  image,
  content,
  children,
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
    <li className="card bg-base-100 image-full col-span-6 md:col-span-4 shadow-xl overflow-hidden group cursor-pointer transition-transform hover:scale-105">
      <figure className="w-full">
        <Image src={image} alt={title} fill={true} />
      </figure>
      <div className="card-body md:invisible group-hover:visible">
        <h2 className="card-title md:text-4xl tracking-tight">{title}</h2>
        <p className="whitespace-pre-wrap max-md:text-xs">{content}</p>
        <div className="card-actions justify-end">
          <Link
            href={href}
            className={[
              isActive ? 'btn-primary font-bold' : 'font-light',
              'btn max-md:w-full md:btn-wide',
            ].join(' ')}
          >
            <div className="md:mx-4 lg:mx-6">{children}</div>
          </Link>
        </div>
      </div>
    </li>
  );
}
