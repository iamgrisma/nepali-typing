import type { APIRoute, GetStaticPaths } from 'astro';
import { OG_CARDS, generateOgSvg, type OgCardData } from '../../lib/og-svg';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () => {
  return Object.keys(OG_CARDS).map((slug) => ({
    params: { slug },
    props: { card: OG_CARDS[slug] },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const card = (props as { card: OgCardData }).card;
  const svg = generateOgSvg(card);

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
