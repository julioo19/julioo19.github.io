import { useState } from 'react';

const links = ['About me', 'Projects', 'Skills', 'Contact me!'];

function Navbar() {
  const [activeLink, setActiveLink] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 flex items-center justify-between px-6 py-6 md:justify-center">
      
      {/* Logo */}
      <span className="font-mono text-sm font-bold uppercase tracking-widest text-white">
        jupu<span className="text-accent">.</span>
      </span>

      {/* Nav pill - desktop */}
      <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-2 backdrop-blur-md md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
        {links.map((link) => (
          <button
            key={link}
            onClick={() => setActiveLink(link)}
            className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
              activeLink === link
                ? 'bg-accent text-dark'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {link}
          </button>
        ))}
      </nav>

      {/* Botón hamburguesa - mobile */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex flex-col gap-1.5 md:hidden"
        aria-label="Abrir menú"
      >
        <span className="h-0.5 w-6 bg-white" />
        <span className="h-0.5 w-6 bg-white" />
      </button>

      {/* Menú desplegable - mobile */}
      {isMenuOpen && (
        <nav className="absolute left-0 top-full mt-2 flex w-full flex-col gap-1 bg-dark/95 px-6 py-4 backdrop-blur-md md:hidden">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => {
                setActiveLink(link);
                setIsMenuOpen(false);
              }}
              className={`rounded-lg px-4 py-3 text-left font-mono text-xs uppercase tracking-widest ${
                activeLink === link ? 'bg-accent text-dark' : 'text-white/70'
              }`}
            >
              {link}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;