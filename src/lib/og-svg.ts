/**
 * Vector SVG Open Graph Card Generator for Typeshala Bench (typing.topnepali.com)
 * Optimized for ImageEngine (img.topnepali.com/typing.tn/og/*-svg.webp)
 */

import { LOGO_PNG_BASE64 } from './logo-data';

export interface OgCardData {
  slug: string;
  badge: string;
  title: string;
  subtitle: string;
  sampleText: string;
  sampleSubtext: string;
  primaryAccent: string;
  secondaryAccent: string;
  meta1Label: string;
  meta1Value: string;
  meta2Label: string;
  meta2Value: string;
  meta3Label: string;
  meta3Value: string;
  meta4Label: string;
  meta4Value: string;
}

export const OG_CARDS: Record<string, OgCardData> = {
  default: {
    slug: 'default',
    badge: 'ONLINE TYPING STANDARD',
    title: 'Typeshala Bench',
    subtitle: 'Modern Online Nepali & English Typing Speed Benchmark',
    sampleText: 'नेपालमा टाइप गर्ने सबैभन्दा आधुनिक तथा आधिकारिक प्लेटफर्म',
    sampleSubtext: 'Unicode Traditional • Romanized Phonetic • Preeti • English QWERTY',
    primaryAccent: '#ef4444',
    secondaryAccent: '#38bdf8',
    meta1Label: 'Speed Benchmark',
    meta1Value: 'Real-time WPM',
    meta2Label: 'Accuracy',
    meta2Value: 'Biometric 99%',
    meta3Label: 'Layouts',
    meta3Value: '4 Top Keymaps',
    meta4Label: 'Certification',
    meta4Value: 'QR Verified',
  },
  home: {
    slug: 'home',
    badge: 'TYPESHALA BENCH',
    title: 'Typeshala Bench Online',
    subtitle: 'Nepal\'s Official Typing Speed & Certification Platform',
    sampleText: 'नेपालमा टाइप गर्ने सबैभन्दा आधुनिक तथा आधिकारिक प्लेटफर्म',
    sampleSubtext: 'Traditional Unicode • Romanized • Preeti • English QWERTY',
    primaryAccent: '#ef4444',
    secondaryAccent: '#f43f5e',
    meta1Label: 'Engines',
    meta1Value: '4 Layouts',
    meta2Label: 'Stories',
    meta2Value: 'Dantya Katha',
    meta3Label: 'Exam Target',
    meta3Value: 'Loksewa Ready',
    meta4Label: 'Credential',
    meta4Value: 'Digital Cert',
  },
  traditional: {
    slug: 'traditional',
    badge: 'MPP REMINGTON HARDWARE',
    title: 'Nepali Unicode Traditional',
    subtitle: 'Hardware-Standard Devanagari Speed Test & Practice',
    sampleText: 'श्री ५ बडा महाराजधिराज पृथ्वीनारायण शाहको उपदेश र ऐतिहासिक दस्ताबेज',
    sampleSubtext: 'Remington Keymap • Halant Conjuncts • Zero Lag Input Engine',
    primaryAccent: '#ef4444',
    secondaryAccent: '#f97316',
    meta1Label: 'Encoding',
    meta1Value: 'UTF-8 Unicode',
    meta2Label: 'Benchmark',
    meta2Value: '20+ WPM Pass',
    meta3Label: 'Mapping',
    meta3Value: 'MPP Standard',
    meta4Label: 'Exam Target',
    meta4Value: 'Loksewa Aayog',
  },
  romanized: {
    slug: 'romanized',
    badge: 'PHONETIC TRANSLITERATION',
    title: 'Nepali Romanized Typing',
    subtitle: 'Type Nepali Naturally with English Keyboard Letters',
    sampleText: 'mero nepali typing yaha abhyas garirahanchhu • ramro chha',
    sampleSubtext: 'Phonetic MPP Standard • In-Browser Instant Devanagari Conversion',
    primaryAccent: '#0ea5e9',
    secondaryAccent: '#38bdf8',
    meta1Label: 'Input Mode',
    meta1Value: 'Romanized',
    meta2Label: 'Layout',
    meta2Value: 'QWERTY Map',
    meta3Label: 'Encoding',
    meta3Value: 'Devanagari',
    meta4Label: 'Speed Goal',
    meta4Value: '40+ WPM',
  },
  preeti: {
    slug: 'preeti',
    badge: 'TYPEWRITER ASCII & CONVERTER',
    title: 'Preeti Typing & Converter',
    subtitle: 'Traditional ASCII Typewriter Test & Unicode Transliteration',
    sampleText: "g]kfn ;/sf/ • k|d'v k|zf;sLo clws[tsf] sfof{no",
    sampleSubtext: 'Kantipur / Preeti Layout • Bidirectional Word & Docs Formatter',
    primaryAccent: '#f59e0b',
    secondaryAccent: '#fbbf24',
    meta1Label: 'Font Type',
    meta1Value: 'Preeti ASCII',
    meta2Label: 'Converter',
    meta2Value: 'Bidirectional',
    meta3Label: 'Format Preserved',
    meta3Value: 'Bold & Italic',
    meta4Label: 'Word Export',
    meta4Value: '.doc Supported',
  },
  english: {
    slug: 'english',
    badge: 'TOUCH TYPING SPEED',
    title: 'English Typing Speed Test',
    subtitle: 'Measure Words Per Minute (WPM) & Keystroke Precision',
    sampleText: 'The quick brown fox jumps over the lazy dog in record time',
    sampleSubtext: 'Standard 5-Stroke Words • Gross & Net WPM • Error Latency Analysis',
    primaryAccent: '#6366f1',
    secondaryAccent: '#818cf8',
    meta1Label: 'Layout',
    meta1Value: 'US QWERTY',
    meta2Label: 'Passing Score',
    meta2Value: '25+ Net WPM',
    meta3Label: 'Durations',
    meta3Value: '1 / 2 / 5 Min',
    meta4Label: 'Drills',
    meta4Value: 'Adaptive AI',
  },
  loksewa: {
    slug: 'loksewa',
    badge: 'PSC SIMULATION EXAM',
    title: 'Loksewa Typing Simulator',
    subtitle: 'Official 5-Minute Civil Service Computer Operator Benchmark',
    sampleText: 'लोक सेवा आयोग कम्प्युटर अपरेटर प्रयोगात्मक परीक्षा अभ्यास प्रणाली',
    sampleSubtext: 'Official Marking Formula • Error Deduction Penalties • 5 Min Timer',
    primaryAccent: '#10b981',
    secondaryAccent: '#34d399',
    meta1Label: 'Exam Duration',
    meta1Value: '5 Minutes',
    meta2Label: 'Syllabus',
    meta2Value: 'PSC Nepal',
    meta3Label: 'Speed Benchmark',
    meta3Value: '20+ WPM Nepali',
    meta4Label: 'Accuracy',
    meta4Value: '85% Minimum',
  },
  test: {
    slug: 'test',
    badge: 'FORMAL PROCTORED EXAM',
    title: 'Typing Certification Exam',
    subtitle: 'Earn Official Digital Typing Credentials with QR Verification',
    sampleText: 'काठमाडौँ महानगरपालिका प्रमुख बालेन्द्र शाहको सम्बोधन',
    sampleSubtext: 'Secure Session Lockdown • Anti-Cheat Verification • Public Registry',
    primaryAccent: '#ec4899',
    secondaryAccent: '#f472b6',
    meta1Label: 'Credential',
    meta1Value: 'Digital PDF',
    meta2Label: 'Audit Hash',
    meta2Value: 'SHA-256 ID',
    meta3Label: 'Verification',
    meta3Value: 'QR & D1 DB',
    meta4Label: 'Validity',
    meta4Value: 'Permanent',
  },
  'keyboard-layout': {
    slug: 'keyboard-layout',
    badge: 'HARDWARE MAPPING',
    title: 'Nepali Keyboard Layouts',
    subtitle: 'Complete Visual Cheatsheet: Traditional, Romanized & Preeti',
    sampleText: 'क ख ग घ ङ • च छ ज झ ञ • ट ठ ड ढ ण • त थ द ध न • प फ ब भ म',
    sampleSubtext: 'Shift / Normal Matrix • Halant & Ligatures • Printable Reference',
    primaryAccent: '#8b5cf6',
    secondaryAccent: '#a78bfa',
    meta1Label: 'Layouts',
    meta1Value: '4 Layouts',
    meta2Label: 'Interactive',
    meta2Value: 'Live Press',
    meta3Label: 'Display',
    meta3Value: 'Full Matrix',
    meta4Label: 'Cheat Sheet',
    meta4Value: 'Key Mapping',
  },
  drills: {
    slug: 'drills',
    badge: 'AI BIOMETRIC TRAINING',
    title: 'Adaptive Typing Drills',
    subtitle: 'Laser-Target & Conquer Your Weakest Keystrokes',
    sampleText: 'High-frequency ngram extraction targeting your hesitation keys',
    sampleSubtext: 'Density-scoring algorithm dynamically surfaces your error letters',
    primaryAccent: '#f97316',
    secondaryAccent: '#fb923c',
    meta1Label: 'Detection',
    meta1Value: 'Error Keys',
    meta2Label: 'Speed Gain',
    meta2Value: '+15 WPM Avg',
    meta3Label: 'Languages',
    meta3Value: 'Nepali & Eng',
    meta4Label: 'Feedback',
    meta4Value: 'Instant',
  },
  analytics: {
    slug: 'analytics',
    badge: 'NEUROMOTOR TELEMETRY',
    title: 'Typeshala Analytics',
    subtitle: 'Speed Records, Net WPM & Keystroke Biomechanics',
    sampleText: '36 Calibrated Keystroke Telemetry Parameters & Neuromotor Heatmaps',
    sampleSubtext: 'Hand load balance, stroke flight times, peak WPM vs fatigue curve',
    primaryAccent: '#06b6d4',
    secondaryAccent: '#22d3ee',
    meta1Label: 'Telemetry',
    meta1Value: '36 Metrics',
    meta2Label: 'Latency',
    meta2Value: 'Millisecond',
    meta3Label: 'Hand Load',
    meta3Value: 'Left / Right',
    meta4Label: 'Storage',
    meta4Value: 'Local & D1',
  },
  verify: {
    slug: 'verify',
    badge: 'PUBLIC VERIFICATION',
    title: 'Certificate Verification',
    subtitle: 'Public Digital Credential & Examination Board Registry',
    sampleText: 'Verifying authentic typing test records issued by TopNepali',
    sampleSubtext: 'Direct D1 Cryptographic Signature & Examination Board Lookup',
    primaryAccent: '#14b8a6',
    secondaryAccent: '#2dd4bf',
    meta1Label: 'Database',
    meta1Value: 'Cloudflare D1',
    meta2Label: 'Security',
    meta2Value: 'Tamper Proof',
    meta3Label: 'Format',
    meta3Value: 'Public Portal',
    meta4Label: 'Lookup',
    meta4Value: 'Instant ID',
  },
  about: {
    slug: 'about',
    badge: 'PLATFORM MISSION',
    title: 'About Typeshala Bench',
    subtitle: 'Pioneering Modern Nepali Typing, Ergonomics & Digital Standards',
    sampleText: 'नेपाली भाषा र सूचना प्रविधिको विकासका लागि समर्पित अनलाइन प्लेटफर्म',
    sampleSubtext: 'Empowering students, civil service candidates, and Nepali writers',
    primaryAccent: '#ef4444',
    secondaryAccent: '#3b82f6',
    meta1Label: 'Initiative',
    meta1Value: 'TopNepali',
    meta2Label: 'Network',
    meta2Value: 'Ecosystem',
    meta3Label: 'Access',
    meta3Value: '100% Free',
    meta4Label: 'Platform',
    meta4Value: 'TopNepali Pro',
  },
  privacy: {
    slug: 'privacy',
    badge: 'DATA PROTECTION',
    title: 'Privacy Policy',
    subtitle: 'Transparent Privacy & Local-First Biometric Security',
    sampleText: 'Your keystroke telemetry and typing history remain on your device',
    sampleSubtext: 'Zero tracking cookies • No third-party data selling • Privacy first',
    primaryAccent: '#3b82f6',
    secondaryAccent: '#60a5fa',
    meta1Label: 'Local-First',
    meta1Value: 'No Data Leak',
    meta2Label: 'Telemetry',
    meta2Value: 'On-Device',
    meta3Label: 'Compliance',
    meta3Value: 'AdSense Safe',
    meta4Label: 'Security',
    meta4Value: 'HTTPS Edge',
  },
  terms: {
    slug: 'terms',
    badge: 'RULES & POLICIES',
    title: 'Terms of Service',
    subtitle: 'Platform Usage, Certification Rules & Acceptable Use Policy',
    sampleText: 'Fair examination guidelines, anti-cheat policy, and service terms',
    sampleSubtext: 'Transparent benchmark standards for honest certification',
    primaryAccent: '#64748b',
    secondaryAccent: '#94a3b8',
    meta1Label: 'Integrity',
    meta1Value: 'Anti-Cheat',
    meta2Label: 'Usage',
    meta2Value: 'Free Tier',
    meta3Label: 'Certs',
    meta3Value: 'Authentic',
    meta4Label: 'Jurisdiction',
    meta4Value: 'Nepal Law',
  },
  contact: {
    slug: 'contact',
    badge: 'CONNECT & SUPPORT',
    title: 'Contact & Support',
    subtitle: 'Get in Touch with the Typeshala Bench & TopNepali Team',
    sampleText: 'Feedback, bug reports, custom enterprise tests, and inquiries',
    sampleSubtext: 'Direct communication with platform maintainers and engineers',
    primaryAccent: '#0ea5e9',
    secondaryAccent: '#38bdf8',
    meta1Label: 'Support Email',
    meta1Value: 'typing@tn',
    meta2Label: 'Response',
    meta2Value: 'Within 24h',
    meta3Label: 'Community',
    meta3Value: 'TopNepali',
    meta4Label: 'Support Desk',
    meta4Value: 'Direct Desk',
  },
};

export function resolveOgCardData(slug: string): OgCardData {
  const clean = slug.toLowerCase().trim().replace(/^og\//, '').replace(/-svg$/, '').replace(/\.svg$/, '');
  return OG_CARDS[clean] || OG_CARDS['default'];
}

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateOgSvg(data: OgCardData): string {
  const title = escapeXml(data.title);
  const subtitle = escapeXml(data.subtitle);
  const badge = escapeXml(data.badge);
  const sampleText = escapeXml(data.sampleText);
  const sampleSubtext = escapeXml(data.sampleSubtext);
  const primaryAccent = data.primaryAccent || '#ef4444';
  const secondaryAccent = data.secondaryAccent || '#38bdf8';

  const m1Label = escapeXml(data.meta1Label);
  const m1Val = escapeXml(data.meta1Value);
  const m2Label = escapeXml(data.meta2Label);
  const m2Val = escapeXml(data.meta2Value);
  const m3Label = escapeXml(data.meta3Label);
  const m3Val = escapeXml(data.meta3Value);
  const m4Label = escapeXml(data.meta4Label);
  const m4Val = escapeXml(data.meta4Value);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  <title>${title} - Typeshala Bench</title>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@600;700;800;900&amp;family=Plus+Jakarta+Sans:wght@600;700;800;900&amp;display=swap');
      text {
        font-family: 'Plus Jakarta Sans', 'Mukta', system-ui, -apple-system, sans-serif;
        text-rendering: geometricPrecision;
      }
      .nepali-font {
        font-family: 'Mukta', system-ui, sans-serif;
      }
    </style>

    <!-- Canvas Background Gradient -->
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070a12" />
      <stop offset="50%" stop-color="#0b1120" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <!-- Glass Card Gradient -->
    <linearGradient id="card-glass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#131d33" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#0a1020" stop-opacity="0.75" />
    </linearGradient>

    <!-- Preview Box Gradient -->
    <linearGradient id="preview-glass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#030712" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#0b1329" stop-opacity="0.8" />
    </linearGradient>

    <!-- Accent Gradient -->
    <linearGradient id="accent-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${primaryAccent}" />
      <stop offset="100%" stop-color="${secondaryAccent}" />
    </linearGradient>

    <!-- Subdued Grid Pattern -->
    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.1" fill="#ffffff" fill-opacity="0.04" />
    </pattern>

    <!-- Ambient Glow Filter -->
    <filter id="ambient-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="95" />
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="1200" height="630" fill="url(#bg-grad)" />
  <rect width="1200" height="630" fill="url(#grid-pattern)" />

  <!-- Ambient Glowing Orbs -->
  <circle cx="100" cy="90" r="260" fill="${primaryAccent}" opacity="0.16" filter="url(#ambient-glow)" />
  <circle cx="1100" cy="140" r="280" fill="${secondaryAccent}" opacity="0.14" filter="url(#ambient-glow)" />
  <circle cx="600" cy="530" r="220" fill="#6366f1" opacity="0.10" filter="url(#ambient-glow)" />

  <!-- Outer Border Frame -->
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="rgba(255, 255, 255, 0.10)" stroke-width="1.2" />

  <!-- HEADER BAR -->
  <g transform="translate(60, 42)">
    <!-- Brand Pill -->
    <rect x="0" y="0" width="380" height="42" rx="21" fill="#0b1329" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2" />
    
    <!-- Official Typeshala Logo Badge -->
    <clipPath id="header-logo-clip">
      <rect x="7" y="7" width="28" height="28" rx="7" />
    </clipPath>
    <rect x="7" y="7" width="28" height="28" rx="7" fill="${primaryAccent}" />
    <image href="${LOGO_PNG_BASE64}" x="7" y="7" width="28" height="28" preserveAspectRatio="xMidYMid slice" clip-path="url(#header-logo-clip)" />

    <!-- Brand Label -->
    <text x="46" y="26" fill="#ffffff" font-size="13" font-weight="800" letter-spacing="0.5">
      TYPESHALA<tspan fill="${primaryAccent}">BENCH</tspan> <tspan fill="#64748b">•</tspan> <tspan fill="#94a3b8" font-size="12" font-weight="600">TOPNEPALI</tspan>
    </text>

    <!-- Right Badge -->
    <g transform="translate(740, 0)">
      <rect x="0" y="0" width="340" height="42" rx="21" fill="${primaryAccent}" fill-opacity="0.14" stroke="${primaryAccent}" stroke-width="1.2" stroke-opacity="0.5" />
      <circle cx="20" cy="21" r="4" fill="${secondaryAccent}" />
      <text x="175" y="26" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="800" letter-spacing="0.8">${badge}</text>
    </g>
  </g>

  <!-- MAIN CARD CONTAINER -->
  <g transform="translate(60, 104)">
    <rect width="1080" height="462" rx="20" fill="url(#card-glass)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.2" />
    <!-- Vertical Accent Strip -->
    <rect x="0" y="20" width="6" height="422" rx="3" fill="url(#accent-grad)" />

    <!-- TITLES & EMBLEM -->
    <g transform="translate(44, 46)">
      <text x="0" y="0" fill="#ffffff" font-size="${title.length > 28 ? '36' : '42'}" font-weight="900" letter-spacing="-0.5">
        ${title}
      </text>

      <text x="0" y="34" fill="${secondaryAccent}" font-size="18" font-weight="700">
        ${subtitle}
      </text>
    </g>

    <!-- Official Logo Emblem Showcase on Card -->
    <g transform="translate(948, 26)">
      <circle cx="44" cy="44" r="44" fill="${primaryAccent}" fill-opacity="0.12" stroke="${primaryAccent}" stroke-width="1.5" stroke-opacity="0.3" />
      <image href="${LOGO_PNG_BASE64}" x="10" y="10" width="68" height="68" preserveAspectRatio="xMidYMid meet" />
    </g>

    <!-- PREVIEW / SPECIMEN DISPLAY BOX -->
    <g transform="translate(44, 142)">
      <rect width="992" height="160" rx="14" fill="url(#preview-glass)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.2" />
      
      <!-- Subtag -->
      <rect x="18" y="14" width="140" height="22" rx="6" fill="#131d33" />
      <text x="88" y="29" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="800" letter-spacing="0.8">BENCHMARK ENGINE</text>

      <!-- Live Typing Sample Text -->
      <text x="24" y="82" fill="#f8fafc" class="nepali-font" font-size="24" font-weight="700">
        ${sampleText}
      </text>

      <!-- Subtext / Description -->
      <text x="24" y="128" fill="#64748b" font-size="15" font-weight="600" letter-spacing="0.3">
        ${sampleSubtext}
      </text>
    </g>

    <!-- 4 STAT PILLS -->
    <g transform="translate(44, 330)">
      <!-- Pill 1 -->
      <g transform="translate(0, 0)">
        <rect width="232" height="90" rx="12" fill="#070d1e" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1" />
        <text x="20" y="42" fill="${secondaryAccent}" font-size="22" font-weight="800">${m1Val}</text>
        <text x="20" y="68" fill="#94a3b8" font-size="11" font-weight="700" text-transform="uppercase" letter-spacing="0.5">${m1Label}</text>
      </g>

      <!-- Pill 2 -->
      <g transform="translate(253, 0)">
        <rect width="232" height="90" rx="12" fill="#070d1e" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1" />
        <text x="20" y="42" fill="#f1f5f9" font-size="22" font-weight="800">${m2Val}</text>
        <text x="20" y="68" fill="#94a3b8" font-size="11" font-weight="700" text-transform="uppercase" letter-spacing="0.5">${m2Label}</text>
      </g>

      <!-- Pill 3 -->
      <g transform="translate(506, 0)">
        <rect width="232" height="90" rx="12" fill="#070d1e" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1" />
        <text x="20" y="42" fill="#38bdf8" font-size="22" font-weight="800">${m3Val}</text>
        <text x="20" y="68" fill="#94a3b8" font-size="11" font-weight="700" text-transform="uppercase" letter-spacing="0.5">${m3Label}</text>
      </g>

      <!-- Pill 4 -->
      <g transform="translate(760, 0)">
        <rect width="232" height="90" rx="12" fill="#070d1e" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1" />
        <text x="20" y="42" fill="#34d399" font-size="22" font-weight="800">${m4Val}</text>
        <text x="20" y="68" fill="#94a3b8" font-size="11" font-weight="700" text-transform="uppercase" letter-spacing="0.5">${m4Label}</text>
      </g>
    </g>
  </g>

  <!-- FOOTER WATERMARK -->
  <g transform="translate(60, 584)">
    <text x="0" y="0" fill="#64748b" font-size="12" font-weight="600" letter-spacing="0.4">
      typing.topnepali.com <tspan fill="#475569">•</tspan> Typeshala Bench Online Nepali &amp; English Speed Platform
    </text>
    <text x="1080" y="0" text-anchor="end" fill="#64748b" font-size="12" font-weight="600">
      Universal Open Graph CDN • img.topnepali.com
    </text>
  </g>
</svg>`;
}
