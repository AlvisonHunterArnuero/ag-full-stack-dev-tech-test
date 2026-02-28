import { Task, DbTask, CreateTaskInput, UpdateTaskInput, TaskFilters, PaginatedTasks } from '../types/task';
import { getDatabase } from '../database/connection';

const mapDbToTask = (dbTask: DbTask): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  description: dbTask.description,
  completed: dbTask.completed,
  userId: dbTask.user_id,
  createdAt: dbTask.created_at?.toISOString(),
  updatedAt: dbTask.updated_at?.toISOString(),
});

export const taskController = {
  async getByUser(userId: number, filters: TaskFilters): Promise<PaginatedTasks> {
    const db = getDatabase();
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const offset = (page - 1) * limit;

    let query = db<DbTask>('tasks').where({ user_id: userId });

    if (filters.status === 'completed') {
      query = query.where({ completed: true });
    } else if (filters.status === 'pending') {
      query = query.where({ completed: false });
    }

    const [{ count }] = await query.clone().count<{ count: string }[]>({ count: '*' });
    const total = parseInt(count, 10);

    const tasks = await query
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      tasks: tasks.map(mapDbToTask),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getAll(filters: TaskFilters): Promise<PaginatedTasks> {
    const db = getDatabase();
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const offset = (page - 1) * limit;

    let query = db<DbTask>('tasks');

    if (filters.status === 'completed') {
      query = query.where({ completed: true });
    } else if (filters.status === 'pending') {
      query = query.where({ completed: false });
    }

    const [{ count }] = await query.clone().count<{ count: string }[]>({ count: '*' });
    const total = parseInt(count, 10);

    const tasks = await query
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      tasks: tasks.map(mapDbToTask),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getById(id: number): Promise<Task | undefined> {
    const db = getDatabase();
    const task = await db<DbTask>('tasks').where({ id }).first();
    return task ? mapDbToTask(task) : undefined;
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const db = getDatabase();
    const [newTask] = await db<DbTask>('tasks')
      .insert({
        title: input.title,
        description: input.description,
        user_id: input.userId,
      })
      .returning(['id', 'title', 'description', 'completed', 'user_id', 'created_at', 'updated_at']);
    return mapDbToTask(newTask);
  },

  async update(id: number, input: UpdateTaskInput): Promise<Task | null> {
    const db = getDatabase();
    const updateData: Partial<DbTask> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.completed !== undefined) updateData.completed = input.completed;

    const [updatedTask] = await db<DbTask>('tasks')
      .where({ id })
      .update(updateData)
      .returning(['id', 'title', 'description', 'completed', 'user_id', 'created_at', 'updated_at']);

    return updatedTask ? mapDbToTask(updatedTask) : null;
  },

  async delete(id: number): Promise<Task | null> {
    const db = getDatabase();
    const [deletedTask] = await db<DbTask>('tasks')
      .where({ id })
      .del()
      .returning(['id', 'title', 'description', 'completed', 'user_id', 'created_at', 'updated_at']);

    return deletedTask ? mapDbToTask(deletedTask) : null;
  },
};
