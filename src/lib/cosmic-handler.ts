import type { APIRoute } from 'astro';

const CDN_PROVIDERS: Record<string, string> = {
  pluto: 'https://fonts-cdn.topnepali.com/font-files',
  universe: 'https://cdn.jsdelivr.net/gh/google/fonts@main',
  galaxy: 'https://cdn.jsdelivr.net/npm/@fontsource',
};

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
  'CDN-Cache-Control': 'public, max-age=31536000, immutable',
  'Cloudflare-CDN-Cache-Control': 'public, max-age=31536000, immutable',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
};

export function createCosmicHandler(providerName: string): APIRoute {
  const provider = providerName.toLowerCase();
  const baseUpstream = CDN_PROVIDERS[provider];

  return async ({ params, request, locals }) => {
    const rawPath = params.path;
    if (!rawPath) {
      return new Response('Missing font path', { status: 400 });
    }

    if (!baseUpstream) {
      return new Response(`Unknown upstream provider: ${provider}`, { status: 404 });
    }

    // 1. Check Cloudflare Edge Cache first if available
    let cache: Cache | null = null;
    try {
      // @ts-ignore
      if (typeof caches !== 'undefined' && caches.default) {
        // @ts-ignore
        cache = caches.default;
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }
      }
    } catch {}

    const isWoff2 = rawPath.endsWith('.woff2');
    const isWoff = rawPath.endsWith('.woff');
    const isOtf = rawPath.endsWith('.otf');
    const contentType = isWoff2 ? 'font/woff2' : isWoff ? 'font/woff' : isOtf ? 'font/otf' : 'font/ttf';

    const targetUrl = `${baseUpstream}/${rawPath}`;

    try {
      const upstreamResp = await fetch(targetUrl);
      if (!upstreamResp.ok) {
        return new Response(`Upstream font not found (${upstreamResp.status})`, { status: upstreamResp.status });
      }

      const data = await upstreamResp.arrayBuffer();

      const response = new Response(data, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          ...CACHE_HEADERS,
        },
      });

      // 2. Cache response into Cloudflare Edge Cache
      if (cache) {
        try {
          // @ts-ignore
          locals.runtime?.ctx?.waitUntil?.(cache.put(request, response.clone()));
        } catch {}
      }

      return response;
    } catch (err) {
      console.error(`Failed to fetch from ${provider} (${targetUrl}):`, err);
      return new Response(`Failed to fetch font from upstream`, { status: 502 });
    }
  };
}
