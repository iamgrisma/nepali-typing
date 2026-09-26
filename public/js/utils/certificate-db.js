/**
 * TopNepali Typing — Certificate & Verification Database Layer
 * Dual-tier storage: High-speed IndexedDB / LocalStorage + Cloudflare D1 Worker API sync
 */

const STORAGE_KEY = 'topnepali_certificates_db';

/**
 * Passing requirements:
 * Nepali: Net WPM > 20 (>= 21 WPM), Accuracy >= 85%
 * English: Net WPM > 25 (>= 26 WPM), Accuracy >= 85%
 */
export function checkCertificationPass(layout, netWpm, accuracy) {
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

/**
 * Assign official Speed Rank Tier
 */
export function getSpeedRank(layout, netWpm) {
  const isEng = layout === 'english';

  if (isEng) {
    if (netWpm >= 90) return { title: 'Speed Demon (Grandmaster)', badge: 'diamond', color: '#8b5cf6' };
    if (netWpm >= 70) return { title: 'Master Typist (Platinum)', badge: 'platinum', color: '#06b6d4' };
    if (netWpm >= 55) return { title: 'Advanced Typist (Gold)', badge: 'gold', color: '#eab308' };
    if (netWpm >= 40) return { title: 'Professional Typist (Silver)', badge: 'silver', color: '#94a3b8' };
    if (netWpm >= 26) return { title: 'Certified Typist (Bronze)', badge: 'bronze', color: '#d97706' };
    return { title: 'Apprentice Typist (Developing)', badge: 'learner', color: '#ef4444' };
  } else {
    // Nepali (Traditional, Romanized, or Preeti ASCII)
    if (netWpm >= 60) return { title: 'Speed Demon (Grandmaster)', badge: 'diamond', color: '#8b5cf6' };
    if (netWpm >= 50) return { title: 'Master Typist (Platinum)', badge: 'platinum', color: '#06b6d4' };
    if (netWpm >= 40) return { title: 'Advanced Typist (Gold)', badge: 'gold', color: '#eab308' };
    if (netWpm >= 30) return { title: 'Professional Typist (Silver)', badge: 'silver', color: '#94a3b8' };
    if (netWpm >= 21) return { title: 'Certified Typist (Bronze)', badge: 'bronze', color: '#d97706' };
    return { title: 'Apprentice Typist (Developing)', badge: 'learner', color: '#ef4444' };
  }
}

/**
 * Generate cryptographic-like verification signature string
 */
function generateSignature(id, name, wpm, date) {
  let hash = 0;
  const str = `${id}:${name}:${wpm}:${date}:TOPNEPALI_OFFICIAL_SECRET`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'SIG-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Create and persist a new official Certificate
 */
export async function saveCertificate(data) {
  const year = new Date().getFullYear();
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const id = `TN-${year}-${randomHex}`;

  const layoutNames = {
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

  // 1. Save to local storage
  try {
    const list = getLocalCertificates();
    list.unshift(certificate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }

  // 2. Asynchronously sync to Cloudflare D1 via Pages Function API
  try {
    fetch('/api/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificate)
    }).catch(() => {});
  } catch (e) {}

  return certificate;
}

/**
 * Retrieve all certificates stored locally
 */
export function getLocalCertificates() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Lookup a certificate by ID (Checks LocalStorage and Cloudflare D1 API)
 */
export async function lookupCertificate(id) {
  if (!id) return null;
  const cleanId = id.trim().toUpperCase();

  // Check local store
  const localList = getLocalCertificates();
  const matchedLocal = localList.find(c => c.id.toUpperCase() === cleanId);
  if (matchedLocal) return matchedLocal;

  // Query Cloudflare D1 API
  try {
    const res = await fetch(`/api/verify?id=${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.valid && data.certificate) {
        return data.certificate;
      }
    }
  } catch (e) {}

  return null;
}
