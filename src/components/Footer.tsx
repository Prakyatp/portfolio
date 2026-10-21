import { CopyEmail } from './CopyEmail';
import { site } from '@/data/site';

export function Footer() {
  return (
    <footer className="contact" id="contact">
      <div className="contact__inner">
        <div className="contact__top">
          <div>
            <p className="contact__lead">Get in touch</p>
            <CopyEmail />
            <p className="prose" style={{ marginTop: 'var(--s-3)', fontSize: 'var(--t-s)' }}>
              {site.availability}. Based in {site.location}.
            </p>
          </div>
          <div className="socials">
            {site.socials.map((s) => (
              <a
                className="btn"
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener' : undefined}
              >
                {s.label} <span className="arrow">&#8599;</span>
              </a>
            ))}
          </div>
        </div>
        <div className="colophon">
          <span>&copy; 2026 {site.name}</span>
          <span>Built with Next.js. Set in Schibsted Grotesk.</span>
        </div>
      </div>
    </footer>
  );
}
