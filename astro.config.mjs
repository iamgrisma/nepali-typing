import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// Full static generation for Cloudflare Pages (Zero CPU, instant CDN delivery)
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [icon()],
  output: 'static',
  site: 'https://typing.topnepali.com',
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
    },
  },
});
