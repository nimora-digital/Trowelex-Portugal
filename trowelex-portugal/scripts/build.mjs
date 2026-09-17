import { cp, mkdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const project = resolve(import.meta.dirname, '..');
const source = join(project, 'src');
const output = join(project, 'dist');
const siteUrl = (process.env.DEPLOY_PRIME_URL || process.env.URL || '').replace(/\/$/, '');
if (siteUrl && !/^https:\/\/[^/]+/.test(siteUrl)) throw new Error('Deployment URL must use HTTPS.');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const pages = [
  'index.html',
  'en/index.html',
  'obrigado/index.html',
  'en/thank-you/index.html',
  'privacidade/index.html',
  'en/privacy/index.html'
];
for (const page of pages) {
  const path = join(output, page);
  let html = await readFile(path, 'utf8');
  html = html.replaceAll('__SITE_ORIGIN__', siteUrl);
  await writeFile(path, html);
}

for (const path of ['assets/logo-original.jpg', 'assets/pool-laranjeira-before-01.jpg', 'assets/pool-laranjeira-finished-01.jpg', 'assets/og.png', 'assets/favicon.svg', 'styles.css', 'site.js']) {
  const info = await stat(join(output, path));
  if (info.size === 0) throw new Error(`Empty output asset: ${path}`);
}

console.log(`Production site ready in dist/ (${pages.length} pages).`);
