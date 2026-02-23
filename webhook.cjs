const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

// SECURITY: Secret must be set via environment variable
const SECRET = process.env.WEBHOOK_SECRET;
const PORT = process.env.WEBHOOK_PORT || 9456;

if (!SECRET) {
  console.error('FATAL: WEBHOOK_SECRET environment variable is not set!');
  process.exit(1);
}

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/deploy') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const signature = req.headers['x-hub-signature-256'];
      const hash = 'sha256=' + crypto.createHmac('sha256', SECRET).update(body).digest('hex');
      
      if (signature === hash) {
        exec('/var/www/novastream/deploy.sh', (err, stdout, stderr) => {
          console.log('Deploy executed:', new Date().toISOString());
          if (err) console.error(stderr);
        });
        res.writeHead(200);
        res.end('Deploying...');
      } else {
        res.writeHead(401);
        res.end('Unauthorized');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => console.log('Webhook server running on port ' + PORT));
