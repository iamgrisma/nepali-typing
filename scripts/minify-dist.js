/**
 * Production Dist JavaScript Minifier
 * Uses esbuild with charset: 'utf8' to safely minify Devanagari Unicode scripts in dist/js
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let esbuild;
try {
  esbuild = require('esbuild');
} catch (err) {
  console.warn('[minify-dist] esbuild not available, skipping minification:', err.message);
  process.exit(0);
}

const distJsDir = path.resolve('dist/js');

if (fs.existsSync(distJsDir)) {
  let totalSaved = 0;
  let fileCount = 0;

  function walkAndMinify(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkAndMinify(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        const originalCode = fs.readFileSync(fullPath, 'utf8');
        try {
          const result = esbuild.transformSync(originalCode, {
            minify: true,
            format: 'esm',
            target: 'es2022',
            charset: 'utf8'
          });
          fs.writeFileSync(fullPath, result.code, 'utf8');
          const saved = originalCode.length - result.code.length;
          totalSaved += saved;
          fileCount++;
        } catch (err) {
          console.warn(`[minify-dist] Failed to minify ${entry.name}:`, err.message);
        }
      }
    }
  }

  walkAndMinify(distJsDir);
  console.log(`[minify-dist] Minified ${fileCount} scripts in dist/js (saved ${(totalSaved / 1024).toFixed(1)} KiB)`);
} else {
  console.log('[minify-dist] dist/js not found, skipping.');
}
