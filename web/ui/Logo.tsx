import Image from 'next/image';

export function Logo() {
  return (
    <figure className="relative">
      <Image src={'/logo.png'} alt="Luckyland Logo" width={256} height={256} />
    </figure>
  );
}
