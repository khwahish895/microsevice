import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { fork } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startGateway() {
  const app = express();
  const PORT = 3000;

  // Start microservices as child processes
  process.env.JWT_SECRET = 'microservices-demo-secret';
  
  // Use tsx to execute child processes in dev
  const execArgv = process.env.NODE_ENV !== 'production' ? ['--import', 'tsx'] : [];

  const authService = fork(path.join(__dirname, '../auth/server.ts'), [], { env: process.env, execArgv });
  const userService = fork(path.join(__dirname, '../user/server.ts'), [], { env: process.env, execArgv });
  const aiService = fork(path.join(__dirname, '../ai/server.ts'), [], { env: process.env, execArgv });

  console.log('Spawning microservices...');

  // Proxy Routes
  app.use('/api/auth', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
  app.use('/api/users', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
  app.use('/api/ai', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));

  // Vite middleware for frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gateway running on http://localhost:${PORT}`);
    console.log('Routes:');
    console.log('  /api/auth -> Port 3001');
    console.log('  /api/users -> Port 3002');
    console.log('  /api/ai -> Port 3003');
    console.log('  / (Vue/React) -> Vite Dev Server');
  });
}

startGateway().catch(console.error);
