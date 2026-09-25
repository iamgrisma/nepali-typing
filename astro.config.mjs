import { defineConfig } from 'astro/config';

// Full static generation for Cloudflare Pages (Zero CPU, instant CDN delivery)
export default defineConfig({
  output: 'static',
  site: 'https://typing.topnepali.com',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
