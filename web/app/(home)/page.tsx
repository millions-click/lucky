import { PlayButton } from './_ui/PlayButton';

export default function Landing() {
  const bg = "bg-[url('/assets/images/landing.jpg')]";
  const className = [
    'hero min-h-screen w-full container mx-auto',
    bg,
    'bg-cover bg-center bg-no-repeat',
  ].join(' ');

  // TODO: Generate a backdrop filter for the image to be used as a background
  return (
    <div className={className}>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <PlayButton />
        </div>
      </div>
    </div>
  );
}
