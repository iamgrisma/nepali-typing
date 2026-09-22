/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<{
  CDN_BASE_URL: string;
  ENVIRONMENT: string;
}>;

declare namespace App {
  interface Locals extends Runtime {}
}
