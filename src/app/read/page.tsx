import type { Metadata } from 'next';
import Link from 'next/link';
import {
  contactLinks,
  education,
  projects,
  publications,
  research,
  roles,
  site,
  skills,
} from '@/data/site';
import { ReadNav, type Section } from './ReadNav';
import { readSans, readSerif } from '../fonts';
import './read.css';

export const metadata: Metadata = {
  title: 'Read',
  description: `${site.name} in plain text: education, research, experience, projects and contact, on one page.`,
  alternates: { canonical: '/read' },
};

const SECTIONS: Section[] = [
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const RESUME_FILE = 'Prakyat-Prakash-Resume.pdf';

export default function Read() {
  return (
    <div className={`readpage ${readSerif.variable} ${readSans.variable}`}>
      {/* Sticky, so the table of contents is reachable from anywhere in the document.
          It sits outside the article because it spans the window, not the text column. */}
      <div className="readbar">
        <div className="readbar__inner">
          <a className="readbar__mark" href="#top">
            {site.name}
          </a>
          <nav className="readbar__nav" aria-label="Sections">
            <ReadNav sections={SECTIONS} />
          </nav>
          <a className="readbar__cta" href="/resume.pdf" download={RESUME_FILE}>
            Résumé ↓
          </a>
        </div>
      </div>

      <article className="read" id="top">
      <header className="read__top">
        <div>
          <h1 className="read__name">{site.name}</h1>
          <p className="read__role">{site.role}</p>
        </div>
        <div className="read__actions">
          <a
            className="read__action read__action--primary"
            href="/resume.pdf"
            download={RESUME_FILE}
          >
            Download résumé ↓
          </a>
          <Link className="read__action" href="/">
            The shelf →
          </Link>
        </div>
      </header>

      <p className="read__meta">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <span>{site.location}</span>
        {site.socials
          .filter((s) => s.href.startsWith('http'))
          .map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener">
              {s.label}
            </a>
          ))}
        <span>{site.availability}</span>
      </p>

      <section className="read__section" aria-labelledby="summary-h">
        <h2 className="read__h2" id="summary-h">
          Summary
        </h2>
        <p className="read__lead">{site.intro}</p>
      </section>

      <section className="read__section" id="education" aria-labelledby="education-h">
        <h2 className="read__h2" id="education-h">
          Education
        </h2>
        <div className="entry">
          <div className="entry__head">
            <h3 className="entry__title">{education.school}</h3>
            <span className="entry__when">{education.period}</span>
          </div>
          <p className="entry__where">
            {education.degree} · {education.place}
          </p>
          <ul className="tags">
            {education.courses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="read__section" id="experience" aria-labelledby="experience-h">
        <h2 className="read__h2" id="experience-h">
          Experience
        </h2>
        {roles.map((r) => (
          <div className="entry" key={`${r.org}-${r.title}`}>
            <div className="entry__head">
              <h3 className="entry__title">{r.title}</h3>
              <span className="entry__when">{r.period}</span>
            </div>
            <p className="entry__where">
              {r.org} · {r.place}
            </p>
            <ul className="entry__points">
              {r.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="read__section" id="research" aria-labelledby="research-h">
        <h2 className="read__h2" id="research-h">
          Research
        </h2>
        <p className="read__lead">{research.lead}</p>
        {research.body.map((p) => (
          <p className="read__p" key={p}>
            {p}
          </p>
        ))}
        {/* A label, not a heading: the papers under it are already h3, the same level as the
            roles and projects, and a heading here would sit at the level of its own children. */}
        <p className="read__sub">Publications</p>
        {publications.map((pub) => (
          <div className="entry" key={pub.doi}>
            <div className="entry__head">
              <h3 className="entry__title">{pub.title}</h3>
              <span className="entry__when">{pub.year}</span>
            </div>
            <p className="entry__authors">
              {pub.authorsBefore}
              <strong>Prakash, P.</strong>
              {pub.authorsAfter} <em>{pub.journal}</em>.
            </p>
            <a className="entry__doi" href={pub.doi} target="_blank" rel="noopener">
              {pub.doi}
            </a>
          </div>
        ))}
      </section>

      <section className="read__section" id="projects" aria-labelledby="projects-h">
        <h2 className="read__h2" id="projects-h">
          Projects
        </h2>
        {projects.map((p) => (
          <div className="entry project" key={p.href}>
            {/* The screenshot is the link, as it is inside the book: the thing you see is the
                thing you click. The heading link beside it carries the accessible name, so the
                image link is hidden from the accessibility tree rather than repeating it. */}
            <a
              className="project__shot"
              href={p.href}
              target="_blank"
              rel="noopener"
              tabIndex={-1}
              aria-hidden="true"
            >
              {/* A plain <img>, not next/image: these are two small static screenshots, the
                  optimizer would save nothing worth having, and this keeps the page working
                  under a static export. The intrinsic size is the files' real 1100×630, so
                  the row reserves its height before the picture arrives. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.cover.src} alt="" width={1100} height={630} loading="lazy" decoding="async" />
            </a>
            <div className="project__body">
              <div className="entry__head">
                <h3 className="entry__title">
                  <a href={p.href} target="_blank" rel="noopener">
                    {p.title}
                  </a>
                </h3>
                <span className="entry__when">{p.year}</span>
              </div>
              <a className="entry__link" href={p.href} target="_blank" rel="noopener">
                {p.destination} ↗
              </a>
              <p className="project__blurb">{p.blurb}</p>
              <ul className="tags">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <section className="read__section" id="skills" aria-labelledby="skills-h">
        <h2 className="read__h2" id="skills-h">
          Skills
        </h2>
        <div className="skillset">
          {skills.map((g) => (
            <div className="skillset__group" key={g.group}>
              <h3 className="skillset__label">{g.group}</h3>
              <p className="skillset__items">{g.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="read__section" id="contact" aria-labelledby="contact-h">
        <h2 className="read__h2" id="contact-h">
          Contact
        </h2>
        <p className="read__lead">
          {site.availability}. Based in {site.location}.
        </p>
        <ul className="contact">
          {contactLinks.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener' : undefined}
              >
                <span className="contact__label">{c.label}</span>
                <span className="contact__hint">{c.hint}</span>
                <span className="contact__go" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="read__foot">
        <span>© 2026 {site.name}</span>
        <span>
          This is the plain version. <Link href="/">The shelf</Link> is the same material as five
          books you can take off a shelf and open.
        </span>
      </footer>
      </article>
    </div>
  );
}
