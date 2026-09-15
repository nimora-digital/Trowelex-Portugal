import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('..', import.meta.url));
const production = process.argv.includes('--production');
const roots = production ? [resolve(project, 'dist')] : [resolve(project, 'src'), resolve(project, 'public')];
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, HEAD' });
    res.end('This local preview does not receive quote requests. Please use the email option or call Wilkins.');
    return;
  }
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/preview-config.js') {
      res.writeHead(200, { 'Content-Type': types['.js'], 'Cache-Control': 'no-store' });
      res.end('window.WILKINS_LOCAL_PREVIEW = true;');
      return;
    }
    if (pathname === '/') pathname = '/index.html';
    if (['/privacy', '/thank-you'].includes(pathname)) pathname += '.html';
    for (const root of roots) {
      const path = resolve(root, '.' + pathname);
      if (!path.startsWith(root + sep)) continue;
      try {
        if (!(await stat(path)).isFile()) continue;
        const body = await readFile(path);
        res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
        res.end(req.method === 'HEAD' ? undefined : body);
        return;
      } catch { /* Try the next source directory. */ }
    }
    res.writeHead(404, { 'Content-Type': types['.html'] });
    res.end(await readFile(resolve(roots[0], '404.html')).catch(() => '<h1>Page not found</h1><a href="/">Return home</a>'));
  } catch {
    res.writeHead(400); res.end('Invalid request');
  }
});
server.listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173/'));
process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
