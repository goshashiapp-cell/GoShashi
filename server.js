// Root server.js for Hostinger Node.js deployment
const path = require('path');
const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';

const app = next({
  dev,
  dir: path.join(__dirname, 'apps', 'web'),
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error handling request:', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, () => {
      console.log(`> GoShashi Web Server ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start Next.js application:', err);
    process.exit(1);
  });
