#!/usr/bin/env node
import Module from 'node:module';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const require = createRequire(import.meta.url);

// Support both local and global/home node_modules resolution
const fallbackDir = '/data/data/com.termux/files/home/buyernepal/node_modules';
if (!fs.existsSync(path.join(process.cwd(), 'node_modules/astro')) && fs.existsSync(fallbackDir)) {
  process.env.NODE_PATH = fallbackDir + (process.env.NODE_PATH ? ':' + process.env.NODE_PATH : '');
  // @ts-ignore
  Module._initPaths();
}

// Fix WASI preopens for Android/Termux environments
try {
  const wasiMod = require('node:wasi');
  const OrigWASI = wasiMod.WASI;
  wasiMod.WASI = function(opts) {
    if (opts && opts.preopens) {
      opts = { ...opts, preopens: { [process.cwd()]: process.cwd() } };
    }
    return new OrigWASI(opts);
  };
} catch {}

let cliUrl;
try {
  const localAstro = path.join(process.cwd(), 'node_modules/astro/dist/cli/index.js');
  if (fs.existsSync(localAstro)) {
    cliUrl = pathToFileURL(localAstro);
  } else {
    cliUrl = pathToFileURL(path.join(fallbackDir, 'astro/dist/cli/index.js'));
  }
} catch {
  cliUrl = pathToFileURL(path.join(fallbackDir, 'astro/dist/cli/index.js'));
}

const cfIndex = process.argv.indexOf('--cloudflare');
if (cfIndex !== -1) {
  process.env.DEPLOY_TARGET = 'cloudflare';
  process.argv.splice(cfIndex, 1);
}

const { cli } = await import(cliUrl.href);
await cli(process.argv);
