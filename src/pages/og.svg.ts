import type { APIRoute } from 'astro';
import { resolveOgCardData, generateOgSvg } from '../lib/og-svg';

export const prerender = true;

export const GET: APIRoute = async () => {
  const ogData = resolveOgCardData('default');
  const svg = generateOgSvg(ogData);

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=604800, s-maxage=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
