import { cp, mkdir, readFile, writeFile, rm, readdir, stat } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const project = fileURLToPath(new URL('..', import.meta.url));
const output = resolve(project, 'dist');
if (output !== join(project, 'dist')) throw new Error('Build output must stay inside the project.');
const company = JSON.parse(await readFile(join(project, 'public/company.json'), 'utf8'));
const localAsset = async asset => {
  if (typeof asset !== 'string' || !asset.startsWith('/assets/') || asset.includes('..')) throw new Error('Company images must be local /assets/ files.');
  if (!(await stat(join(project, 'public', asset))).isFile()) throw new Error(`Missing asset: ${asset}`);
};
if (company.logo) await localAsset(company.logo);
if (company.heroImage) { await localAsset(company.heroImage.src); if (!company.heroImage.alt) throw new Error('Hero image needs descriptive alt text.'); }
for (const service of company.additionalServices) { if (!service.title || !service.description || !service.confirmedSource) throw new Error('Only confirmed services may be published.'); if (service.image) await localAsset(service.image); }
for (const entry of company.projects) { await localAsset(entry.image); if (!entry.title || !entry.alt || !entry.confirmedSource) throw new Error('Project photos need titles, alt text and confirmed sources.'); }
for (const review of company.reviews) { if (!review.author || !review.text || !review.confirmedSource) throw new Error('Reviews must have a confirmed source.'); }
if (company.facebookUrl && !/^https:\/\/(www\.)?facebook\.com\//.test(company.facebookUrl)) throw new Error('Use the confirmed Facebook page URL.');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(join(project, 'public'), output, { recursive: true });
await cp(join(project, 'src'), output, { recursive: true });

const originValue = process.env.SITE_URL || process.env.DEPLOY_PRIME_URL || process.env.URL;
let origin = null;
if (originValue) { const parsed = new URL(originValue); if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('SITE_URL must be an HTTP(S) origin.'); origin = parsed.origin; }
let html = await readFile(join(output, 'index.html'), 'utf8');
if (origin) {
  const safeOrigin = origin.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  html = html.replaceAll('content="/assets/og.png"', `content="${safeOrigin}/assets/og.png"`);
  html = html.replace('</head>', `  <link rel="canonical" href="${safeOrigin}/">\n  <meta property="og:url" content="${safeOrigin}/">\n</head>`);
  await writeFile(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${safeOrigin}/</loc></url></urlset>`);
}
await writeFile(join(output, 'index.html'), html);
await writeFile(join(output, 'robots.txt'), origin ? `User-agent: *\nAllow: /\nDisallow: /thank-you.html\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nAllow: /\nDisallow: /thank-you.html\n');

async function filesIn(directory) { const result = []; for (const file of await readdir(directory, { withFileTypes: true })) { const path = join(directory, file.name); if (file.isDirectory()) result.push(...await filesIn(path)); else result.push(path); } return result; }
for (const path of await filesIn(output)) {
  if (extname(path) === '.js') execFileSync(process.execPath, ['--check', path], { stdio: 'pipe' });
  if (extname(path) === '.html') {
    const page = await readFile(path, 'utf8');
    for (const reference of page.matchAll(/(?:src|href)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      if (reference[1] === '/') continue;
      const target = resolve(output, '.' + reference[1]);
      if (!target.startsWith(output)) throw new Error(`Invalid asset reference: ${reference[1]}`);
      if (!(await stat(target).catch(() => null))?.isFile()) throw new Error(`Broken reference in ${path}: ${reference[1]}`);
    }
    if (/chatgpt\.site|openai|starter placeholder/i.test(page)) throw new Error('Unexpected public template branding.');
  }
}
console.log('Production build complete: dist');
console.log('All HTML references and JavaScript syntax verified.');
if (!origin) console.log('Local build: set SITE_URL or let Netlify supply DEPLOY_PRIME_URL for absolute social URLs and a sitemap.');
