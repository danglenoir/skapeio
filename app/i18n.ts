export const nav = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'references', label: 'References' },
  { id: 'jord', label: 'JORD' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' },
] as const;

export type NavEntry = (typeof nav)[number];

export const hero = {
  accessibleTitle: 'Hello, we are skape.io. We deliver web development, cloud infrastructure, DevOps, networking, privacy, and IT project management.',
  things: [
    'web development.',
    'cloud infrastructure.',
    'devops.',
    'networking.',
    'privacy.',
    'IT project management.',
  ],
} as const;

export const about = {
  index: '01',
  title: 'About us',
  text: [
    'We operate in the shadows of the digital realm, providing uncompromising infrastructure and architectural solutions. skape.io is not just a technology provider; we are the silent partners in your most critical operations, ensuring that your digital footprint is secure, scalable, and resilient against any threat. Our methodologies are forged in the fires of high-stakes environments where failure is not an option.',
    "By leveraging cutting-edge cloud native principles, Zero Trust architectures, and advanced deployment strategies, we craft environments that are as impenetrable as they are efficient. Every line of code, every network configuration, and every infrastructure deployment is executed with military precision. We don't just build systems; we engineer strategic advantages.",
  ],
} as const;

export const partners = [
  {
    label: 'Brain Bar',
    src: '/partners/brain-bar.a384a6991f.svg',
  },
  {
    label: 'Déryné',
    src: '/partners/deryne.428840d46f.svg',
  },
  {
    label: 'Madách Színház',
    src: '/partners/madach-szinhaz.cc7928784e.svg',
  },
  {
    label: 'Magyar Nemzeti Bank',
    src: '/partners/magyar-nemzeti-bank.df43842f5a.svg',
  },
  {
    label: 'Spirit FM',
    src: '/partners/spirit-fm.d4ff76ee2f.svg',
  },
  {
    label: 'Veszprém-Balaton 2023',
    src: '/partners/veszprem-balaton-2023.128df0fd4a.svg',
  },
] as const;

export const jord = {
  title: 'JORD',
  text: [
    'The ultimate cloud-based CMS. Engineered for maximum security, zero-latency content delivery, and total operational control.',
  ],
  cta: {
    label: 'Explore JORD',
    href: null,
    unavailableLabel: 'JORD website coming soon.',
  },
} as const;

export const services = {
  title: 'Capabilities',
  items: [
    {
      id: 'web-development',
      title: 'Web Dev',
      description: 'High-performance, secure digital interfaces engineered for scale and resilience.',
    },
    {
      id: 'devops',
      title: 'DevOps',
      description: 'Continuous integration, automated deployments, and unyielding infrastructure architecture.',
    },
    {
      id: 'it-project-management',
      title: '360° IT PM',
      description: 'End-to-end tactical oversight, ensuring absolute operational success from inception to deployment.',
    },
    {
      id: 'networking',
      title: 'Networking',
      description: 'Secure, low-latency communication matrices designed for classified data transmission.',
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Zero-knowledge architectures and cryptographic defense mechanisms to protect sensitive assets.',
    },
    {
      id: 'ai-solutions',
      title: 'AI Solutions',
      description: 'Strategic implementation of artificial intelligence for predictive analysis and automation.',
    },
  ],
} as const;

export const contact = {
  headline: 'Contact us',
} as const;

export const footer = {
  items: [
    { dialogId: 'privacy-policy', label: 'Privacy Policy' },
    { dialogId: 'imprint', label: 'Imprint' },
  ],
} as const;
