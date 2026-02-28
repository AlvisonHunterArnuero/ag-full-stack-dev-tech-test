import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { userController } from '../controllers/users';
import { updateUserSchema, idParamSchema } from '../schemas/users';
import { authenticate, requireAdmin } from '../auth/middleware';

export async function userRoutes(fastify: FastifyInstance) {
  // GET /users — admin only
  fastify.get('/users', {
    preHandler: [authenticate, requireAdmin],
  }, async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await userController.getAll();
    return reply.send(users);
  });

  // GET /users/me
  fastify.get('/users/me', {
    preHandler: [authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await userController.getById(request.user.id);
    if (!user) return reply.status(404).send({ error: 'User not found' });
    return reply.send(user);
  });

  // GET /users/:id
  fastify.get('/users/:id', {
    schema: idParamSchema,
    preHandler: [authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const id = parseInt(params.id);

    if (request.user.role !== 'admin' && request.user.id !== id) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    const user = await userController.getById(id);
    if (!user) return reply.status(404).send({ error: 'User not found' });
    return reply.send(user);
  });

  // PUT /users/:id
  fastify.put('/users/:id', {
    schema: { ...idParamSchema, ...updateUserSchema },
    preHandler: [authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const body = request.body as { name?: string; email?: string };
    const id = parseInt(params.id);

    if (request.user.role !== 'admin' && request.user.id !== id) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    const user = await userController.update(id, body);
    if (!user) return reply.status(404).send({ error: 'User not found' });
    return reply.send(user);
  });

  // DELETE /users/:id — admin only
  fastify.delete('/users/:id', {
    schema: idParamSchema,
    preHandler: [authenticate, requireAdmin],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    const id = parseInt(params.id);
    const user = await userController.delete(id);
    if (!user) return reply.status(404).send({ error: 'User not found' });
    return reply.send(user);
  });
}
