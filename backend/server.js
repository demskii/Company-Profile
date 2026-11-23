import app from './app.js';
import { checkConnection, pool } from './config/db.js';

const port = Number(process.env.PORT || 5000);

async function start() {
  try {
    await checkConnection();
    console.log(`[db] connected to ${process.env.DB_NAME} at ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
  } catch (error) {
    console.error('[db] connection failed:', error.message);
    process.exit(1);
  }

  const server = app.listen(port, () => {
    console.log(`[api] http://localhost:${port}`);
  });

  const shutdown = (signal) => {
    console.log(`[api] ${signal} received, shutting down`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
