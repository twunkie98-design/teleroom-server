const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT) || 3000;
const entry = 'INDEX65C.HTM';

const types = {
  '.htm': 'text/html; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.web': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8'
};

const sendJson = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
};

const server = http.createServer((req, res) => {
  let url;
  try {
    url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    return sendJson(res, 400, { error: 'Bad request' });
  }

  if (url.pathname === '/api/health') {
    return sendJson(res, 200, { status: 'ok', service: 'teleroom', version: '1.0.0' });
  }

  let requested;
  try {
    requested = decodeURIComponent(url.pathname);
  } catch {
    return sendJson(res, 400, { error: 'Bad request' });
  }

  let filePath = path.resolve(root, '.' + (requested === '/' ? '/' + entry : requested));
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    return sendJson(res, 403, { error: 'Forbidden' });
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || stats.isDirectory()) {
      if (!path.extname(filePath)) filePath = path.join(root, entry);
      else return sendJson(res, 404, { error: 'Not found' });
    }

    fs.readFile(filePath, (readError, data) => {
      if (readError) return sendJson(res, 404, { error: 'Not found' });
      res.writeHead(200, {
        'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(data);
    });
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Teleroom server listening on port ${port}`);
});
