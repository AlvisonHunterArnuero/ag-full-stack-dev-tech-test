import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { taskController } from '../controllers/tasks';
import { createTaskSchema, updateTaskSchema, idParamSchema, taskQuerySchema } from '../schemas/tasks';
import { authenticate, requireAdmin } from '../auth/middleware';
import { TaskFilters } from '../types/task';

export async function taskRoutes(fastify: FastifyInstance) {
  // GET /tasks
  fastify.get('/tasks', {
    schema: taskQuerySchema,
    preHandler: [authenticate],
  }, async (request, reply) => {
    const query = request.query as { status?: string; page?: string; limit?: string; all?: string };
    const filters: TaskFilters = {
      status: query.status as TaskFilters['status'],
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 10,
    };

    const isAdmin = request.user.role === 'admin';
    const wantsAll = query.all === 'true';

    const result =
      isAdmin && wantsAll
        ? await taskController.getAll(filters)
        : await taskController.getByUser(request.user.id, filters);

    return reply.send(result);
  });

  // GET /tasks/:id
  fastify.get('/tasks/:id', {
    schema: idParamSchema,
    preHandler: [authenticate],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const id = parseInt(params.id);
    const task = await taskController.getById(id);

    if (!task) {
      return reply.status(404).send({ error: 'Task not found' });
    }

    if (request.user.role !== 'admin' && task.userId !== request.user.id) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    return reply.send(task);
  });

  // POST /tasks
  fastify.post('/tasks', {
    schema: createTaskSchema,
    preHandler: [authenticate],
  }, async (request, reply) => {
    const body = request.body as { title: string; description: string };
    const newTask = await taskController.create({
      title: body.title,
      description: body.description,
      userId: request.user.id,
    });
    return reply.status(201).send(newTask);
  });

  // PUT /tasks/:id
  fastify.put('/tasks/:id', {
    schema: { ...idParamSchema, ...updateTaskSchema },
    preHandler: [authenticate],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as { title?: string; description?: string; completed?: boolean };
    const id = parseInt(params.id);

    const existing = await taskController.getById(id);
    if (!existing) {
      return reply.status(404).send({ error: 'Task not found' });
    }
    if (request.user.role !== 'admin' && existing.userId !== request.user.id) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    const task = await taskController.update(id, body);
    return reply.send(task);
  });

  // DELETE /tasks/:id
  fastify.delete('/tasks/:id', {
    schema: idParamSchema,
    preHandler: [authenticate],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const id = parseInt(params.id);
    console.log(`[DELETE] Attempting to delete task ID: ${id} for user: ${request.user.id}`);

    const existing = await taskController.getById(id);
    if (!existing) {
      console.log(`[DELETE] Task ${id} not found`);
      return reply.status(404).send({ error: 'Task not found' });
    }
    if (request.user.role !== 'admin' && existing.userId !== request.user.id) {
      console.log(`[DELETE] Access denied for task ${id}`);
      return reply.status(403).send({ error: 'Access denied' });
    }

    try {
      const task = await taskController.delete(id);
      console.log(`[DELETE] Successfully deleted task ${id}`);
      return reply.send(task);
    } catch (error) {
      console.error(`[DELETE] Error deleting task ${id}:`, error);
      throw error;
    }
  });
}
