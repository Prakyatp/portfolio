// All visible content for the site.
//
// Everything about the work, the roles, the papers and the education is real and comes from
// Prakyat's own material. The only things to replace are marked `TODO(prakyat)` below: they are
// the personal details only he can write.

export type Project = {
  index: string;
  title: string;
  year: string;
  blurb: string;
  stack: string[];
  href: string;
  destination: string; // what the click actually opens, said plainly
  cover: { src: string; alt: string };
};

export type Publication = {
  title: string;
  authorsBefore: string;
  authorsAfter: string;
  journal: string;
  year: string;
  doi: string;
};

export type Role = {
  title: string;
  org: string;
  period: string;
  place: string;
  points: string[];
};

export const site = {
  name: 'Prakyat Prakash',
  role: 'Software engineer and machine learning researcher',
  url: 'https://prakyatprakash.com',
  description:
    'Software engineer and ML researcher at RIT. I build data pipelines, full-stack systems and models that go from notebook to production.',
  email: 'prakyat02@gmail.com',
  location: 'Rochester, NY',
  availability: 'Open to 2026 SWE and ML roles',
  statement: 'I build systems that work and models that learn.',
  intro:
    'Software engineer and pipelines architect by practice: data pipelines, full-stack systems, and ML models that go from notebook to production. I also do research, on proteomics and how the genome regulates itself.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prakyatp' },
    { label: 'GitHub', href: 'https://github.com/Prakyatp' },
    { label: 'Resume', href: '/resume.pdf' },
  ],
};

export const education = {
  school: 'Rochester Institute of Technology',
  abbr: 'RIT',
  degree: 'Master of Science, Computer Science',
  period: 'Aug 2024 to Dec 2026',
  place: 'Rochester, NY',
  courses: [
    'Data Structures & Algorithms',
    'Computer Architecture',
    'Machine Learning',
    'Foundations of AI',
    'Big Data',
    'Advanced Computer Vision',
  ],
};

export const research = {
  lead: 'Getting signal out of noisy biology',
  body: [
    'I work in the Cui Lab at RIT on machine learning for molecular biology: which computational methods survive contact with a real experiment, and which quietly learn the shape of the experiment instead.',
    'Two threads right now. Building rigorous extraction pipelines for post-translational modification data, which meant correcting an assumption the field had accepted for years. And studying genomics and 3D chromatin organization with deep learning models.',
  ],
};

export const publications: Publication[] = [
  {
    title: 'Machine learning-based determination of sex-related bladder cancer biomarkers',
    authorsBefore: 'Pizzi, J.R., Adhikari, I., ',
    authorsAfter: ', Miyamoto, H., and Cui, F.',
    journal: 'Frontiers in Bioinformatics',
    year: '2026',
    doi: 'https://doi.org/10.3389/fbinf.2026.1794098',
  },
  {
    title:
      'Intrinsic DNA codes govern distinct modes of nucleosome and transcription factor interactions',
    authorsBefore: 'Carson, C.W., Nagalakshmi, S.U., Adhikari, I., Freewoman, J.M., Pizzi, J.R., ',
    authorsAfter: ', and Cui, F.',
    journal: 'Nature Communications',
    year: '2026',
    doi: 'https://doi.org/10.1038/s41467-026-74448-4',
  },
];

// Every card opens the thing itself, not a write-up about it.
export const projects: Project[] = [
  {
    index: '01',
    title: 'WC2026 Hydration Break Analyzer',
    year: '2026',
    blurb:
      'Scrapes every World Cup match from ESPN, finds the exact hydration break timestamps, and measures attacking pressure either side of the whistle. Pressing teams lose momentum across the break; the teams being pressed gain it. Rebuilds itself daily.',
    stack: ['Python', 'ESPN API', 'Next.js', 'Groq', 'GitHub Actions'],
    href: 'https://prakyatp.github.io/wc2026-break-analyzer/',
    destination: 'Live dashboard',
    cover: {
      src: '/assets/preview/wc2026.jpg',
      alt: 'The WC2026 break analyzer dashboard, comparing attacking pressure before and after hydration breaks',
    },
  },
  {
    index: '02',
    title: 'PTM Dataset Extraction Pipeline',
    year: '2026',
    blurb:
      'Rebuilt the training data for phosphorylation site prediction. The field calls every unreported residue a negative; this verifies them instead, turning 24.4M peptide-spectrum matches into 361,789 checked sites and cutting a trypsin sampling bias from 33.2% to 3.6%.',
    stack: ['Python', 'Pandas', 'NumPy', 'UniProt'],
    href: 'https://prakyatp.github.io/PTM_Negatives_Extraction/',
    destination: 'Live dashboard',
    cover: {
      src: '/assets/preview/ptm.jpg',
      alt: 'The PTM extraction dashboard, showing dataset summary counts across five repositories',
    },
  },
  {
    index: '03',
    title: 'CareBridge',
    year: '2026',
    blurb:
      'A cost navigator for people deciding whether to have a procedure done abroad. Pricing, treatment length and recovery time structured across ten countries and thirty procedures, with a retrieval chatbot over it and the patient journey modelled as a graph.',
    stack: ['Python', 'RAG', 'Neo4j', 'LLMs', 'Vector DB'],
    href: 'https://github.com/Prakyatp/carebridge',
    destination: 'Repository',
    cover: {
      src: '/assets/preview/carebridge.jpg',
      alt: 'The CareBridge interface, comparing the cost of procedures across countries',
    },
  },
];

export const roles: Role[] = [
  {
    title: 'Graduate Research Assistant, Machine Learning',
    org: 'Rochester Institute of Technology',
    period: 'May 2025 to present',
    place: 'Rochester, NY',
    points: [
      'Co-authored 2 research papers in computational genomics: a peer-reviewed publication in Frontiers in Bioinformatics on ML-based bladder cancer biomarker discovery, and a paper in Nature Communications on nucleosome and transcription factor interactions.',
      'Engineered an end-to-end PTM verified-negatives extraction pipeline processing 24.4M raw peptide-spectrum matches into 361,789 verified phosphosites across 35 parallel workers.',
      'Built a dual-pass FASTA verification pipeline with tryptic-context filtering, correcting trypsin-cleavage bias and reducing terminal-K over-representation from 33.2% to 3.6%.',
    ],
  },
  {
    title: 'AI Engineer',
    org: 'Handshake AI',
    period: 'Jan 2025 to Apr 2025',
    place: 'Remote, NY',
    points: [
      'Architected an LLM-based RAG pipeline for Python automation tasks, improving code generation accuracy by 25% through targeted retrieval optimization and prompt engineering.',
      'Built a systematic LLM evaluation and debugging workflow using LangChain tooling, cutting output error rates by 30% and enabling faster root-cause diagnosis of model failures.',
      'Standardized response generation frameworks for chat-based LLM interactions, driving consistent, production-grade execution across automated workflows.',
    ],
  },
  {
    title: 'AI Intern',
    org: 'Acinonyx Technologies Pvt. Ltd.',
    period: 'Mar 2024 to Jun 2024',
    place: 'Bengaluru, India',
    points: [
      'Built an AI-driven backend service with Flask and REST APIs to automate license management, cutting manual oversight by 30% and streamlining renewals for 500+ users.',
      'Developed an ML model to predict license-expiration patterns, enabling real-time tracking and cutting unexpected service downtime by 40%.',
      'Applied AI-powered analytics on transactional data to trigger automated payment reminders, improving processing efficiency and driving sales growth.',
    ],
  },
];

// ── Off the clock ────────────────────────────────────────────────────────────
// TODO(prakyat): the only writing here that is not already yours. Keep it to one honest line
// and swap the interests for what you actually spend time on.
export const offTheClock = {
  line: 'Away from work I play blackjack, take apart games for the systems underneath, and build small things to answer questions I got curious about.',
  interests: ['Blackjack', 'Gaming', 'Side projects', 'Football data'],
};
