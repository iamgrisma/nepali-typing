import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  session: false,
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: { enabled: process.env.CF_PROXY === 'true' },
  }),
  site: 'https://typing.topnepali.com',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
