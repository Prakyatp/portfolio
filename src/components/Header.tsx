'use client';
import { site } from '@/data/site';

const SECTIONS = [
  { label: 'Education', href: '#education' },
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
];

export function Header() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="wordmark" href="#main">
          {site.name}
        </a>
        <nav className="topnav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href}>
              {s.label}
            </a>
          ))}
          <a className="btn" href="#contact">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
