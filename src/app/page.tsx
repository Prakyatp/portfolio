import Image from 'next/image';
import { LanyardPass } from '@/components/LanyardPass';
import { education, offTheClock, projects, publications, research, roles, site } from '@/data/site';

export default function Home() {
  return (
    <>
      {/* ── 1. The landing. One screen: the pass, and nothing else. ──────── */}
      <section className="landing">
        <LanyardPass />
        <div className="landing__foot">
          <p className="landing__line" data-enter style={{ '--d': 0.9 } as React.CSSProperties}>
            {site.statement}
          </p>
          <a
            className="landing__cue"
            href="#about"
            data-enter
            style={{ '--d': 1 } as React.CSSProperties}
          >
            Keep going
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path
                d="M8 2v11M3.5 8.5 8 13l4.5-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <p className="landing__hint" data-enter style={{ '--d': 1.1 } as React.CSSProperties}>
            Pick it up and swing it
          </p>
        </div>
      </section>

      {/* ── 1b. The pitch, in words ───────────────────────────────────────── */}
      <section className="shell hero" id="about">
        <div className="hero__grid">
          <div>
            <p className="hero__statement" data-reveal>
              {site.intro}
            </p>
            <div className="hero__actions" data-reveal>
              <span className="pill">{site.availability}</span>
              <a className="btn btn--primary" href="#projects">
                See the projects
              </a>
              <a className="btn" href="/resume.pdf" target="_blank" rel="noopener">
                Resume <span className="arrow">&#8599;</span>
              </a>
            </div>
          </div>

          <aside className="glance card" data-reveal>
            <dl>
              <div>
                <dt>Now</dt>
                <dd>
                  {roles[0].title.replace(', Machine Learning', '')}, {education.abbr}
                </dd>
              </div>
              <div>
                <dt>Studying</dt>
                <dd>{education.degree}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>
                  {publications.length} papers in {publications[0].year}
                </dd>
              </div>
              <div>
                <dt>Based</dt>
                <dd>{site.location}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* ── 2. Education ─────────────────────────────────────────────────── */}
      <section className="shell" id="education">
        <div className="sec-head" data-reveal>
          <h2>Education</h2>
          <span className="sec-head__aside">{education.period}</span>
        </div>
        <div className="card edu" data-reveal>
          <span className="edu__mark" aria-hidden="true">
            {education.abbr}
          </span>
          <div className="edu__body">
            <div className="edu__row">
              <h3 className="edu__school">{education.school}</h3>
              <span className="meta">{education.place}</span>
            </div>
            <p className="edu__degree">{education.degree}</p>
            <ul className="chips">
              {education.courses.map((c) => (
                <li className="chip" key={c}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 3. Research ──────────────────────────────────────────────────── */}
      <section className="shell" id="research">
        <div className="sec-head" data-reveal>
          <h2>Research</h2>
          <span className="sec-head__aside">{publications.length} papers, 2026</span>
        </div>
        <div className="research">
          <div data-reveal>
            <p className="prose">{research.body[0]}</p>
            <p className="prose">{research.body[1]}</p>
          </div>
          <div className="pubs" data-reveal>
            {publications.map((pub) => (
              <a className="pub" key={pub.doi} href={pub.doi} target="_blank" rel="noopener">
                <span>
                  <span className="pub__title">
                    {pub.title} <span className="arrow">&#8599;</span>
                  </span>
                  <span className="pub__authors">
                    {pub.authorsBefore}
                    <b>Prakash, P.</b>
                    {pub.authorsAfter}
                  </span>
                </span>
                <span className="pub__right">
                  <span className="pub__journal">{pub.journal}</span>
                  <br />
                  <span className="meta">{pub.year}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Projects. Every card opens the live thing. ─────────────────── */}
      <section className="shell" id="projects">
        <div className="sec-head" data-reveal>
          <h2>Projects</h2>
          <span className="sec-head__aside">Each card opens the live site</span>
        </div>
        <div className="projects">
          {projects.map((p) => (
            <a
              className="proj"
              key={p.index}
              href={p.href}
              target="_blank"
              rel="noopener"
              data-reveal
            >
              <span className="proj__shot">
                <Image
                  src={p.cover.src}
                  alt={p.cover.alt}
                  width={1100}
                  height={688}
                  sizes="(max-width: 860px) 92vw, 22rem"
                />
              </span>
              <span className="proj__body">
                <h3 className="proj__title">{p.title}</h3>
                <span className="proj__blurb">{p.blurb}</span>
                <span className="proj__tags">
                  {p.stack.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </span>
              </span>
              <span className="proj__open">
                {p.destination}
                <span className="arrow">&#8599;</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Experience ───────────────────────────────────────────────────── */}
      <section className="shell" id="experience">
        <div className="sec-head" data-reveal>
          <h2>Experience</h2>
          <span className="sec-head__aside">{roles.length} roles since 2024</span>
        </div>
        <div className="xp">
          {roles.map((r) => (
            <article className="xp__item" key={r.org} data-reveal>
              <div className="xp__when">
                <span className="meta">{r.period}</span>
                <span className="meta">{r.place}</span>
              </div>
              <div>
                <h3 className="xp__title">{r.title}</h3>
                <p className="xp__org">{r.org}</p>
                <ul className="xp__points">
                  {r.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 5. Off the clock ─────────────────────────────────────────────── */}
      <section className="shell" id="off-the-clock">
        <div className="sec-head" data-reveal>
          <h2>Off the clock</h2>
        </div>
        <div className="off" data-reveal>
          <p className="prose off__text">{offTheClock.line}</p>
          <ul className="off__tags">
            {offTheClock.interests.map((t) => (
              <li className="chip" key={t}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
