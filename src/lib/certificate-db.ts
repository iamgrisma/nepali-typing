/**
 * TopNepali Typing — Certificate & Verification Database Layer (TypeScript)
 */

const STORAGE_KEY = 'topnepali_certificates_db';

export function checkCertificationPass(layout: string, netWpm: number, accuracy: number) {
  const isEng = layout === 'english';
  const minWpm = isEng ? 25 : 20;
  const isWpmPass = netWpm > minWpm;
  const isAccPass = accuracy >= 85;

  return {
    passed: isWpmPass && isAccPass,
    minWpm,
    requiredAcc: 85,
    wpmDeficit: isWpmPass ? 0 : (minWpm + 1 - netWpm),
    accDeficit: isAccPass ? 0 : (85 - accuracy)
  };
}

export function getSpeedRank(layout: string, netWpm: number) {
  const isEng = layout === 'english';

  if (isEng) {
    if (netWpm >= 90) return { title: 'Speed Demon (Grandmaster)', badge: 'diamond', color: '#8b5cf6' };
    if (netWpm >= 70) return { title: 'Master Typist (Platinum)', badge: 'platinum', color: '#06b6d4' };
    if (netWpm >= 55) return { title: 'Advanced Typist (Gold)', badge: 'gold', color: '#eab308' };
    if (netWpm >= 40) return { title: 'Professional Typist (Silver)', badge: 'silver', color: '#94a3b8' };
    if (netWpm >= 26) return { title: 'Certified Typist (Bronze)', badge: 'bronze', color: '#d97706' };
    return { title: 'Apprentice Typist (Developing)', badge: 'learner', color: '#ef4444' };
  } else {
    if (netWpm >= 60) return { title: 'Speed Demon (Grandmaster)', badge: 'diamond', color: '#8b5cf6' };
    if (netWpm >= 50) return { title: 'Master Typist (Platinum)', badge: 'platinum', color: '#06b6d4' };
    if (netWpm >= 40) return { title: 'Advanced Typist (Gold)', badge: 'gold', color: '#eab308' };
    if (netWpm >= 30) return { title: 'Professional Typist (Silver)', badge: 'silver', color: '#94a3b8' };
    if (netWpm >= 21) return { title: 'Certified Typist (Bronze)', badge: 'bronze', color: '#d97706' };
    return { title: 'Apprentice Typist (Developing)', badge: 'learner', color: '#ef4444' };
  }
}

function generateSignature(id: string, name: string, wpm: number, date: string): string {
  let hash = 0;
  const str = `${id}:${name}:${wpm}:${date}:TOPNEPALI_OFFICIAL_SECRET`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'SIG-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

export async function saveCertificate(data: {
  candidateName: string;
  layout: string;
  mode?: string;
  durationSeconds?: number;
  netWpm: number;
  rawWpm?: number;
  accuracy: number;
  consistency?: number;
  cpm?: number;
  totalKeystrokes?: number;
  correctKeystrokes?: number;
  errorKeystrokes?: number;
  analytics?: any;
}) {
  const year = new Date().getFullYear();
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const id = `TN-${year}-${randomHex}`;

  const layoutNames: Record<string, string> = {
    nepali_unicode: 'Nepali Unicode (Traditional MPP)',
    nepali_romanized: 'Nepali Unicode (Romanized Phonetic)',
    nepali_preeti: 'Preeti Font (Standard ASCII)',
    english: 'English (US QWERTY Standard)'
  };

  const rank = getSpeedRank(data.layout, data.netWpm);
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certificate = {
    id,
    candidateName: data.candidateName.trim() || 'Anonymous Candidate',
    layout: data.layout,
    layoutLabel: layoutNames[data.layout] || data.layout,
    mode: data.mode || 'exam',
    durationSeconds: data.durationSeconds || 300,
    netWpm: data.netWpm,
    rawWpm: data.rawWpm || data.netWpm,
    accuracy: data.accuracy,
    consistency: data.consistency || 95,
    cpm: data.cpm || Math.round(data.netWpm * 5),
    totalKeystrokes: data.totalKeystrokes || 0,
    correctKeystrokes: data.correctKeystrokes || 0,
    errorKeystrokes: data.errorKeystrokes || 0,
    rankTitle: rank.title,
    rankBadge: rank.badge,
    rankColor: rank.color,
    status: 'QUALIFIED',
    issuedAt: formattedDate,
    issuedTimestamp: now.getTime(),
    verificationUrl: `https://typing.topnepali.com/verify?id=${id}`,
    signature: generateSignature(id, data.candidateName, data.netWpm, formattedDate),
    analytics: data.analytics || {}
  };

  if (typeof window !== 'undefined') {
    try {
      const list = getLocalCertificates();
      list.unshift(certificate);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) {}

    try {
      fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificate)
      }).catch(() => {});
    } catch (e) {}
  }

  return certificate;
}

export function getLocalCertificates(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export async function lookupCertificate(id: string): Promise<any | null> {
  if (!id) return null;
  const cleanId = id.trim().toUpperCase();

  const localList = getLocalCertificates();
  const matchedLocal = localList.find((c: any) => c.id.toUpperCase() === cleanId);
  if (matchedLocal) return matchedLocal;

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/verify?id=${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.valid && data.certificate) {
          return data.certificate;
        }
      }
    } catch (e) {}
  }

  return null;
}
