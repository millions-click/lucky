export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: 'url(/assets/images/bg/realms.webp)',
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        {children}
      </div>
    </div>
  );
}
