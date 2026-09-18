import type { ReactNode } from 'react';

interface ButtonProps {
  href: string;
  children: ReactNode;
}

const Button = ({ href, children }: ButtonProps) => {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-3 rounded-full bg-accent py-2 pl-6 pr-2 font-mono text-xs uppercase tracking-widest text-dark transition-transform hover:scale-105"
    >
      {children}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform group-hover:rotate-45">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-dark"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </span>
    </a>
  );
};

export default Button;