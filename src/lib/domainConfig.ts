/**
 * TopNepali Network Unified Domain, SEO & AdSense Policy Configuration
 * Centralized governance for all TopNepali applications:
 * - election: https://election.topnepali.com
 * - constitution: https://constitution.topnepali.com
 * - blog: https://topnepali.com
 * - tools: https://topnepali.com/tools
 * - typing: https://typing.topnepali.com
 * - fonts: https://fonts.topnepali.com
 * - share: https://share.topnepali.com
 */

export interface NetworkAppConfig {
  id: string;
  name: string;
  canonicalOrigin: string;
  homePath: string;
  canonicalHomeUrl: string;
  approvedHosts: string[];
}

export const TOPNEPALI_NETWORK_APPS: Record<string, NetworkAppConfig> = {
  election: {
    id: 'election',
    name: 'Election Nepal',
    canonicalOrigin: 'https://election.topnepali.com',
    homePath: '/',
    canonicalHomeUrl: 'https://election.topnepali.com',
    approvedHosts: ['election.topnepali.com', 'www.election.topnepali.com'],
  },
  constitution: {
    id: 'constitution',
    name: 'Constitution',
    canonicalOrigin: 'https://constitution.topnepali.com',
    homePath: '/',
    canonicalHomeUrl: 'https://constitution.topnepali.com',
    approvedHosts: ['constitution.topnepali.com', 'www.constitution.topnepali.com'],
  },
  blog: {
    id: 'blog',
    name: 'TopNepali Hub',
    canonicalOrigin: 'https://topnepali.com',
    homePath: '/',
    canonicalHomeUrl: 'https://topnepali.com',
    approvedHosts: ['topnepali.com', 'www.topnepali.com'],
  },
  tools: {
    id: 'tools',
    name: 'TopTools',
    canonicalOrigin: 'https://topnepali.com',
    homePath: '/tools',
    canonicalHomeUrl: 'https://topnepali.com/tools',
    approvedHosts: ['topnepali.com', 'www.topnepali.com', 'tools.topnepali.com'],
  },
  typing: {
    id: 'typing',
    name: 'Nepali Typing',
    canonicalOrigin: 'https://typing.topnepali.com',
    homePath: '/',
    canonicalHomeUrl: 'https://typing.topnepali.com',
    approvedHosts: ['typing.topnepali.com', 'www.typing.topnepali.com'],
  },
  fonts: {
    id: 'fonts',
    name: 'FontsDir',
    canonicalOrigin: 'https://fonts.topnepali.com',
    homePath: '/',
    canonicalHomeUrl: 'https://fonts.topnepali.com',
    approvedHosts: ['fonts.topnepali.com', 'www.fonts.topnepali.com'],
  },
  share: {
    id: 'share',
    name: 'Flashare',
    canonicalOrigin: 'https://share.topnepali.com',
    homePath: '/',
    canonicalHomeUrl: 'https://share.topnepali.com',
    approvedHosts: ['share.topnepali.com', 'www.share.topnepali.com', 'flashare.topnepali.com'],
  },
};

export const ALL_NETWORK_APPROVED_HOSTS = new Set(
  Object.values(TOPNEPALI_NETWORK_APPS).flatMap((app) => app.approvedHosts)
);

export const CANONICAL_SITE_ORIGIN = TOPNEPALI_NETWORK_APPS.typing.canonicalOrigin;

/**
 * Checks if the given hostname is an approved production domain.
 */
export function isProductionDomain(
  hostname: string | null | undefined,
  appId: keyof typeof TOPNEPALI_NETWORK_APPS | string = 'typing'
): boolean {
  if (!hostname) return false;
  const cleanHost = hostname.toLowerCase().split(':')[0].trim();

  if (
    cleanHost.endsWith('.workers.dev') ||
    cleanHost.endsWith('.pages.dev') ||
    cleanHost.endsWith('.vercel.app') ||
    cleanHost.endsWith('.netlify.app') ||
    cleanHost === 'localhost' ||
    cleanHost === '127.0.0.1' ||
    cleanHost === '0.0.0.0'
  ) {
    return false;
  }

  if (appId && TOPNEPALI_NETWORK_APPS[appId]) {
    return TOPNEPALI_NETWORK_APPS[appId].approvedHosts.includes(cleanHost);
  }

  return ALL_NETWORK_APPROVED_HOSTS.has(cleanHost);
}

/**
 * Determines whether AdSense scripts and ad tags are permitted to run.
 * Rules:
 * 1. Must be an approved production domain (never workers.dev / pages.dev / localhost)
 * 2. Must be English (locale === 'en' or not Nepali /ne). Strictly prohibited on Nepali.
 * 3. Must not be a policy-sensitive legal page.
 */
export function isAdSenseAllowed(options: {
  hostname: string | null | undefined;
  locale?: string | null;
  pathname?: string | null;
  appId?: string;
}): boolean {
  const { hostname, locale, pathname = '', appId = 'typing' } = options;

  if (!isProductionDomain(hostname, appId)) {
    return false;
  }

  if (locale === 'ne') {
    return false;
  }

  const cleanPath = (pathname || '').toLowerCase();
  if (cleanPath.startsWith('/ne/') || cleanPath === '/ne') {
    return false;
  }

  const legalRoutes = [
    '/privacy', '/terms', '/about', '/faq', '/contact',
    '/certificate/view', '/verify'
  ];
  const pathNoSlash = cleanPath.replace(/\/+$/, '') || '/';
  if (legalRoutes.includes(pathNoSlash)) {
    return false;
  }

  return true;
}

export function isTrackerAllowed(
  hostname: string | null | undefined,
  appId = 'typing'
): boolean {
  return isProductionDomain(hostname, appId);
}

export function isIndexingAllowed(
  hostname: string | null | undefined,
  appId = 'typing'
): boolean {
  return isProductionDomain(hostname, appId);
}

export function getCanonicalSiteOrigin(appId = 'typing'): string {
  return TOPNEPALI_NETWORK_APPS[appId]?.canonicalOrigin || CANONICAL_SITE_ORIGIN;
}

export function getCanonicalHomeUrl(appId = 'typing'): string {
  return TOPNEPALI_NETWORK_APPS[appId]?.canonicalHomeUrl || CANONICAL_SITE_ORIGIN;
}
