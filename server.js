const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.htm': 'text/html',
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.htm' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
      res.end(data);
    }
  });
}).listen(3000, () => {
  console.log('✅ Secure Steps running at http://localhost:3000');
});
