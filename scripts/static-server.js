const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const rootDir = path.resolve(__dirname, '..');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.webp': 'image/webp'
};

function send(response, statusCode, body, type = 'text/plain; charset=utf-8') {
  response.writeHead(statusCode, {
    'Content-Type': type,
    'Cache-Control': 'no-store'
  });
  response.end(body);
}

function resolvePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0]);
  const candidatePath = path.resolve(rootDir, `.${decodedPath}`);
  if (!candidatePath.startsWith(rootDir)) return null;
  return candidatePath;
}

function sendFile(request, response, filePath, contentType, stat) {
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'Accept-Ranges': 'bytes'
  };

  const range = request.headers.range;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) {
      response.writeHead(416, {
        ...headers,
        'Content-Range': `bytes */${stat.size}`
      });
      response.end();
      return;
    }

    let start = match[1] ? Number(match[1]) : 0;
    let end = match[2] ? Number(match[2]) : stat.size - 1;

    if (!match[1] && match[2]) {
      const suffixLength = Math.min(Number(match[2]), stat.size);
      start = stat.size - suffixLength;
      end = stat.size - 1;
    }

    if (
      !Number.isInteger(start)
      || !Number.isInteger(end)
      || start < 0
      || end < start
      || start >= stat.size
    ) {
      response.writeHead(416, {
        ...headers,
        'Content-Range': `bytes */${stat.size}`
      });
      response.end();
      return;
    }

    end = Math.min(end, stat.size - 1);
    const contentLength = end - start + 1;
    response.writeHead(206, {
      ...headers,
      'Content-Length': contentLength,
      'Content-Range': `bytes ${start}-${end}/${stat.size}`
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    fs.createReadStream(filePath, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, {
    ...headers,
    'Content-Length': stat.size
  });
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  const requestPath = request.url === '/' ? '/index.html' : request.url;
  const filePath = resolvePath(requestPath);

  if (!filePath) {
    send(response, 403, 'Forbidden');
    return;
  }

  let finalPath = filePath;
  if (fs.existsSync(finalPath) && fs.statSync(finalPath).isDirectory()) {
    finalPath = path.join(finalPath, 'index.html');
  }

  const stat = fs.existsSync(finalPath) ? fs.statSync(finalPath) : null;
  if (!stat || !stat.isFile()) {
    send(response, 404, 'Not found');
    return;
  }

  const extension = path.extname(finalPath).toLowerCase();
  const contentType = contentTypes[extension] || 'application/octet-stream';
  try {
    sendFile(request, response, finalPath, contentType, stat);
  } catch (error) {
    if (!response.headersSent) {
      send(response, 500, 'Internal server error');
    } else {
      response.destroy();
    }
  }
});

server.listen(port, host, () => {
  console.log(`Static server running at http://${host}:${port}`);
});
