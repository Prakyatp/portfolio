import Image from "next/image";
import EmailLink from "./EmailLink";

const pillStyle: React.CSSProperties = {
  fontSize: "12.5px",
  fontWeight: 500,
  color: "#555",
  background: "#f4f4f1",
  padding: "6px 12px",
  borderRadius: "999px",
};

const tagStyle: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "11.5px",
  color: "#555",
  background: "#f4f4f1",
  padding: "5px 11px",
  borderRadius: "7px",
};

export default function Home() {
  return (
    <div style={{ width: "100%", background: "#ffffff" }}>
      {/* ===== NAV ===== */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #eeeeec",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          Prakyat Prakash
        </div>
        <nav style={{ display: "flex", gap: "30px", fontSize: "15px", color: "#4a4a4a", fontWeight: 500 }}>
          <a href="#education" className="nav-link">Education</a>
          <a href="#research" className="nav-link">Research</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
        <EmailLink
          className="email-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            background: "#111",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
            padding: "10px 18px",
            borderRadius: "10px",
          }}
        >
          Email Me
        </EmailLink>
      </header>

      {/* ===== HERO ===== */}
      <section style={{ padding: "14px 16px 0" }}>
        <div
          className="hero-panel"
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            background: "#121310",
            color: "#ffffff",
            borderRadius: "26px",
            overflow: "hidden",
          }}
        >
          <div className="hero-text">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#c9c9c4",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 0 3px rgba(34,197,94,.22)",
                }}
              />
              Open to 2026 SWE &amp; ML roles
            </div>
            <div style={{ fontSize: "27px", color: "#9d86ff", fontWeight: 600, marginBottom: "16px", letterSpacing: "-0.01em" }}>
              Hi, I am Prakyat Prakash
            </div>
            <h1 style={{ margin: 0, fontSize: "52px", lineHeight: 1.08, fontWeight: 500, letterSpacing: "-0.025em" }}>
              I build systems that <span style={{ color: "#9d86ff" }}>work</span>
              <br />
              and models that <span style={{ color: "#9d86ff" }}>learn</span>.
            </h1>
            <p style={{ margin: "26px 0 0", fontSize: "16px", lineHeight: 1.65, color: "#b6b6b0", maxWidth: "500px" }}>
              Software engineer and pipelines architect by practice: data pipelines, full-stack systems, and ML models
              that go from notebook to production. I also do research, with a focus where computation meets biology.
            </p>
          </div>
          <div className="hero-portrait">
            <Image
              src="/assets/prakyat.jpeg"
              alt="Prakyat Prakash"
              fill
              style={{ objectFit: "cover", objectPosition: "50% 30%" }}
              priority
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg,rgba(18,19,16,.85) 0%,rgba(18,19,16,0) 30%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg,rgba(18,19,16,0) 70%,rgba(18,19,16,.5) 100%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* ===== EDUCATION ===== */}
      <section id="education" style={{ maxWidth: "1180px", margin: "0 auto", padding: "70px 40px" }}>
        <div
          className="reveal"
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: "#5b3df0",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "26px",
          }}
        >
          Education
        </div>
        <div style={{ border: "1px solid #ebebe7", borderRadius: "18px", padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "13px",
                background: "#0e0e0e",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                flexShrink: 0,
              }}
            >
              RIT
            </div>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 600, letterSpacing: "-0.01em" }}>
                  Rochester Institute of Technology
                </h3>
                <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px", color: "#888" }}>
                  Aug 2024 – Dec 2026
                </span>
              </div>
              <div style={{ fontSize: "15.5px", color: "#444", marginTop: "6px" }}>
                Master of Science, Computer Science <span style={{ color: "#aaa" }}>·</span> Rochester, NY
              </div>
              <div style={{ fontSize: "13px", color: "#999", margin: "22px 0 12px" }}>Relevant coursework</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span style={pillStyle}>Data Structures &amp; Algorithms</span>
                <span style={pillStyle}>Computer Architecture</span>
                <span style={pillStyle}>Machine Learning</span>
                <span style={pillStyle}>Foundations of AI</span>
                <span style={pillStyle}>Big Data</span>
                <span style={pillStyle}>Advanced Computer Vision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RESEARCH ===== */}
      <section id="research" style={{ maxWidth: "1180px", margin: "0 auto", padding: "70px 40px" }}>
        <div
          className="reveal"
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: "#5b3df0",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          Research
        </div>
        <h2 className="reveal" style={{ margin: "0 0 28px", fontSize: "42px", fontWeight: 500, letterSpacing: "-0.025em" }}>
          Where computation meets biology
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px 56px", maxWidth: "980px" }}>
          <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.7, color: "#555" }}>
            My research sits at the intersection of machine learning and molecular biology, specifically how
            computational methods can extract signal from messy, large-scale biological data. I work in the Cui Lab
            at RIT, where the problems range from proteomics data engineering to understanding how the genome
            regulates itself.
          </p>
          <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.7, color: "#555" }}>
            Right now I&apos;m focused on two things: building rigorous PTM extraction pipelines for
            post-translational modification data, fixing assumptions the field has accepted for years, and studying
            genomics and 3D chromatin organization through deep learning models. The thread connecting all of it is
            the same: biology generates enormous, noisy datasets, and good software and good models are what turn
            that noise into biology.
          </p>
        </div>

        <div style={{ fontSize: "13px", fontWeight: 500, color: "#999", margin: "54px 0 6px" }}>Published work</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <a
            href="https://doi.org/10.3389/fbinf.2026.1794098"
            target="_blank"
            rel="noopener"
            className="pub-link"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "20px",
              alignItems: "start",
              padding: "24px 0",
              borderTop: "1px solid #ebebe7",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                Machine learning-based determination of sex-related bladder cancer biomarkers
              </h3>
              <div style={{ fontSize: "13.5px", color: "#777", lineHeight: 1.5 }}>
                Pizzi, J.R., Adhikari, I., <strong style={{ color: "#333" }}>Prakash, P.</strong>, Miyamoto, H., &amp;
                Cui, F. <span style={{ color: "#bbb" }}>·</span> <em>Frontiers in Bioinformatics</em>, 2026
              </div>
            </div>
            <span style={{ fontSize: "15px", color: "#999" }}>↗</span>
          </a>
          <a
            href="https://doi.org/10.64898/2025.12.30.697010"
            target="_blank"
            rel="noopener"
            className="pub-link"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "20px",
              alignItems: "start",
              padding: "24px 0",
              borderTop: "1px solid #ebebe7",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                Intrinsic DNA codes govern distinct modes of nucleosome–transcription factor interactions
              </h3>
              <div style={{ fontSize: "13.5px", color: "#777", lineHeight: 1.5 }}>
                Carson, C.W., Nagalakshmi, S.U., Adhikari, I., Freewoman, J.M., Pizzi, J.R.,{" "}
                <strong style={{ color: "#333" }}>Prakash, P.</strong>, &amp; Cui, F. <span style={{ color: "#bbb" }}>·</span>{" "}
                <em>bioRxiv</em>, 2025
              </div>
            </div>
            <span style={{ fontSize: "15px", color: "#999" }}>↗</span>
          </a>
        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section id="experience" style={{ maxWidth: "1180px", margin: "0 auto", padding: "70px 40px" }}>
        <div
          className="reveal"
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: "#5b3df0",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          Experience
        </div>
        <h2 className="reveal" style={{ margin: "0 0 38px", fontSize: "42px", fontWeight: 500, letterSpacing: "-0.025em" }}>
          Where I&apos;ve been building
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: "36px", padding: "30px 0", borderTop: "1px solid #ebebe7" }}>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px", color: "#5b3df0", fontWeight: 500 }}>
              May 2025 – Present
            </div>
            <div style={{ fontSize: "13.5px", color: "#999", marginTop: "8px" }}>Rochester, NY</div>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.01em" }}>
              Graduate Research Assistant <span style={{ color: "#bbb" }}>·</span> Machine Learning
            </h3>
            <div style={{ fontSize: "15px", color: "#666", margin: "4px 0 16px" }}>Rochester Institute of Technology</div>
            <ul style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
              <li style={{ display: "flex", gap: "11px", fontSize: "14.5px", lineHeight: 1.55, color: "#555" }}>
                <span style={{ color: "#5b3df0", flexShrink: 0 }}>▶</span>
                <span>
                  Co-authored 2 research papers in computational genomics: a peer-reviewed publication in{" "}
                  <em>Frontiers in Bioinformatics</em> on ML-based bladder cancer biomarker discovery, and a paper on
                  nucleosome–transcription factor interactions.
                </span>
              </li>
              <li style={{ display: "flex", gap: "11px", fontSize: "14.5px", lineHeight: 1.55, color: "#555" }}>
                <span style={{ color: "#5b3df0", flexShrink: 0 }}>▶</span>
                <span>
                  Engineered an end-to-end PTM verified-negatives extraction pipeline processing 24.4M raw
                  peptide-spectrum matches into 361,789 verified phosphosites across 35 parallel workers.
                </span>
              </li>
              <li style={{ display: "flex", gap: "11px", fontSize: "14.5px", lineHeight: 1.55, color: "#555" }}>
                <span style={{ color: "#5b3df0", flexShrink: 0 }}>▶</span>
                <span>
                  Built a dual-pass FASTA verification pipeline with tryptic-context filtering, correcting
                  trypsin-cleavage bias and reducing terminal-K over-representation from 33.2% to 3.6%.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: "36px", padding: "30px 0", borderTop: "1px solid #ebebe7" }}>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px", color: "#5b3df0", fontWeight: 500 }}>
              Mar 2024 – Jun 2024
            </div>
            <div style={{ fontSize: "13.5px", color: "#999", marginTop: "8px" }}>Bengaluru, India</div>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.01em" }}>AI Intern</h3>
            <div style={{ fontSize: "15px", color: "#666", margin: "4px 0 16px" }}>Acinonyx Technologies Pvt. Ltd.</div>
            <ul style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
              <li style={{ display: "flex", gap: "11px", fontSize: "14.5px", lineHeight: 1.55, color: "#555" }}>
                <span style={{ color: "#5b3df0", flexShrink: 0 }}>▶</span>
                <span>
                  Built an AI-driven backend service with Flask and REST APIs to automate license management, cutting
                  manual oversight by 30% and streamlining renewals for 500+ users.
                </span>
              </li>
              <li style={{ display: "flex", gap: "11px", fontSize: "14.5px", lineHeight: 1.55, color: "#555" }}>
                <span style={{ color: "#5b3df0", flexShrink: 0 }}>▶</span>
                <span>
                  Developed an ML model to predict license-expiration patterns, enabling real-time tracking and
                  cutting unexpected service downtime by 40%.
                </span>
              </li>
              <li style={{ display: "flex", gap: "11px", fontSize: "14.5px", lineHeight: 1.55, color: "#555" }}>
                <span style={{ color: "#5b3df0", flexShrink: 0 }}>▶</span>
                <span>
                  Applied AI-powered analytics on transactional data to trigger automated payment reminders,
                  improving processing efficiency and driving sales growth.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== PROJECTS ===== */}
      <section id="projects" style={{ maxWidth: "1180px", margin: "0 auto", padding: "70px 40px" }}>
        <div
          className="reveal"
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: "#5b3df0",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          Projects
        </div>
        <h2 className="reveal" style={{ margin: "0 0 38px", fontSize: "42px", fontWeight: 500, letterSpacing: "-0.025em" }}>
          Things I&apos;ve built
        </h2>
        <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "12px", scrollSnapType: "x mandatory" }}>
          <div className="project-card" style={{ border: "1px solid #ebebe7", borderRadius: "18px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", minWidth: "420px", scrollSnapAlign: "start" }}>
            <a
              href="https://prakyatp.github.io/PTM_Negatives_Extraction/"
              target="_blank"
              rel="noopener"
              title="Open the PTM Extraction dashboard"
              className="project-card-image"
              style={{ position: "relative", display: "block", background: "#f4f4f1", height: "230px", overflow: "hidden" }}
            >
              <Image
                src="/assets/ptm-dashboard.png"
                alt="PTM Extraction dashboard, dataset summary"
                fill
                style={{ objectFit: "cover", objectPosition: "50% 0%" }}
              />
            </a>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "19px", fontWeight: 600, letterSpacing: "-0.01em" }}>
                PTM Dataset Extraction Pipeline
              </h3>
              <p style={{ margin: "0 0 18px", fontSize: "14px", lineHeight: 1.6, color: "#666" }}>
                Reconstructed phosphorylation and lysine-acetylation training datasets from 5 mass-spectrometry
                repositories, processing 24.4M peptide-spectrum matches into 361,789 tryptic-verified phosphosites.
                Replaced the field-standard &quot;all non-positives are negatives&quot; assumption with true
                experimentally-observed negatives via dual-pass FASTA verification across 35 parallel workers.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "auto", marginBottom: "16px" }}>
                <span style={tagStyle}>Pandas</span>
                <span style={tagStyle}>NumPy</span>
                <span style={tagStyle}>UniProt</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "12px",
                  color: "#999",
                  paddingTop: "14px",
                  borderTop: "1px solid #f0f0ec",
                }}
              >
                <span>Dec 2025 – Mar 2026</span>
                <span style={{ color: "#5b3df0" }}>● Live</span>
              </div>
            </div>
          </div>

          <div className="project-card" style={{ border: "1px solid #ebebe7", borderRadius: "18px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", minWidth: "420px", scrollSnapAlign: "start" }}>
            <div style={{ position: "relative", background: "#121310", height: "230px", overflow: "hidden" }}>
              <Image
                src="/assets/nyc-dashboard.png"
                alt="NYC Employee Time & Pay Dashboard, payroll rules engine"
                fill
                style={{ objectFit: "cover", objectPosition: "50% 50%" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  zIndex: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(14,14,14,.78)",
                  color: "#fff",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "11px",
                  fontWeight: 500,
                  padding: "7px 12px",
                  borderRadius: "8px",
                  backdropFilter: "blur(4px)",
                }}
              >
                In progress
              </span>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "19px", fontWeight: 600, letterSpacing: "-0.01em" }}>
                NYC Employee Time &amp; Pay Dashboard
              </h3>
              <p style={{ margin: "0 0 18px", fontSize: "14px", lineHeight: 1.6, color: "#666" }}>
                Built a serverless payroll system on AWS implementing a NY State labor-law rules engine with 8+
                compliance rules spanning overtime, holiday pay, and spread-of-hours across 500+ shifts. Designed a
                REST API with 5 Lambda-backed endpoints delivering pay-stub generation in under 2 seconds, and
                integrated Spark to batch-process 10,000+ historical records, cutting weekly reporting time by 60%.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "auto", marginBottom: "16px" }}>
                <span style={tagStyle}>Python</span>
                <span style={tagStyle}>AWS Lambda</span>
                <span style={tagStyle}>DynamoDB</span>
                <span style={tagStyle}>API Gateway</span>
                <span style={tagStyle}>S3</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "12px",
                  color: "#999",
                  paddingTop: "14px",
                  borderTop: "1px solid #f0f0ec",
                }}
              >
                <span>Ongoing</span>
                <span>2026</span>
              </div>
            </div>
          </div>
          <a
            href="https://prakyatp.github.io/wc2026-break-analyzer/"
            target="_blank"
            rel="noopener"
            className="project-card"
            style={{ border: "1px solid #ebebe7", borderRadius: "18px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", textDecoration: "none", color: "inherit", minWidth: "420px", scrollSnapAlign: "start" }}
          >
            <div style={{ position: "relative", height: "230px", overflow: "hidden" }}>
              <Image
                src="/assets/wc2026-dashboard.png"
                alt="WC2026 Hydration Break Analyzer dashboard"
                fill
                style={{ objectFit: "cover", objectPosition: "50% 0%" }}
              />
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "19px", fontWeight: 600, letterSpacing: "-0.01em" }}>
                WC2026 Hydration Break Effect Analyzer
              </h3>
              <p style={{ margin: "0 0 18px", fontSize: "14px", lineHeight: 1.6, color: "#666" }}>
                Built a Python pipeline scraping every WC2026 match from ESPN&apos;s API, detecting exact hydration
                break timestamps and measuring attacking pressure in the 10 minutes either side. Found that 85–87% of
                pressing teams lose momentum after breaks while non-pressing teams consistently gain it — a statistically
                significant equalizer effect across 18+ matches. Dashboard auto-updates daily via GitHub Actions.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "auto", marginBottom: "16px" }}>
                <span style={tagStyle}>Python</span>
                <span style={tagStyle}>ESPN API</span>
                <span style={tagStyle}>Next.js</span>
                <span style={tagStyle}>Groq</span>
                <span style={tagStyle}>GitHub Actions</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "12px",
                  color: "#999",
                  paddingTop: "14px",
                  borderTop: "1px solid #f0f0ec",
                }}
              >
                <span>Jun 2026</span>
                <span style={{ color: "#5b3df0" }}>● Live</span>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ===== CONTACT + FOOTER (dark) ===== */}
      <section id="contact" style={{ background: "#0c0c0c", color: "#fff", borderRadius: "26px 26px 0 0", marginTop: "50px" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "54px 40px 30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "36px",
              flexWrap: "wrap",
              paddingBottom: "40px",
              borderBottom: "1px solid #1c1c1c",
            }}
          >
            <div>
              <div style={{ fontSize: "13px", color: "#8a8a8a", marginBottom: "14px" }}>Get in touch</div>
              <EmailLink
                className="contact-email"
                style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 500, letterSpacing: "-0.02em", color: "#fff" }}
              >
                prakyat02@gmail.com
              </EmailLink>
              <div style={{ fontSize: "14px", color: "#8a8a8a", marginTop: "14px" }}>
                Open to software engineering and machine learning roles for 2026.
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <a
                href="https://www.linkedin.com/in/prakyatp"
                target="_blank"
                rel="noopener"
                className="social-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#e6e6e6",
                  background: "#181818",
                  border: "1px solid #262626",
                  padding: "11px 18px",
                  borderRadius: "10px",
                }}
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/Prakyatp"
                target="_blank"
                rel="noopener"
                className="social-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#e6e6e6",
                  background: "#181818",
                  border: "1px solid #262626",
                  padding: "11px 18px",
                  borderRadius: "10px",
                }}
              >
                GitHub
              </a>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "22px", fontSize: "12.5px", color: "#6a6a6a", flexWrap: "wrap", gap: "12px" }}>
            <span>© 2026 Prakyat Prakash</span>
            <span>Rochester, NY</span>
          </div>
        </div>
      </section>
    </div>
  );
}
