import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { initDatabase, closeDatabase } from './database/connection';
import { runMigrations } from './database/migrate';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { taskRoutes } from './routes/tasks';

const fastify = Fastify({
  logger: true,
});

// Register CORS
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Register routes
fastify.register(authRoutes);
fastify.register(userRoutes);
fastify.register(taskRoutes);

// Health check
fastify.get('/health', async (_request, reply) => {
  return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
});

const start = async () => {
  try {
    await initDatabase();
    await runMigrations();

    const port = parseInt(process.env.PORT || '3000', 10);
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    await closeDatabase();
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await fastify.close();
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await fastify.close();
  await closeDatabase();
  process.exit(0);
});

start();
