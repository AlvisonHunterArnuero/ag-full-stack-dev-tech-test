import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authController } from '../controllers/auth';
import { registerSchema, loginSchema } from '../schemas/auth';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/register', { schema: registerSchema }, async (request: FastifyRequest<{ Body: { name: string; email: string; password: string } }>, reply: FastifyReply) => {
    try {
      const result = await authController.register(request.body);
      return reply.status(201).send(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return reply.status(400).send({ error: message });
    }
  });

  fastify.post('/auth/login', { schema: loginSchema }, async (request: FastifyRequest<{ Body: { email: string; password: string } }>, reply: FastifyReply) => {
    try {
      const result = await authController.login(request.body);
      return reply.status(200).send(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return reply.status(401).send({ error: message });
    }
  });
}
