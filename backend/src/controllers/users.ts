import { User, CreateUserInput, UpdateUserInput, DbUser } from '../types/user';
import { getDatabase } from '../database/connection';

export const userController = {
  async getAll(): Promise<User[]> {
    const db = getDatabase();
    return db<DbUser>('users').select('id', 'name', 'email', 'role');
  },

  async getById(id: number): Promise<User | undefined> {
    const db = getDatabase();
    const user = await db<DbUser>('users').where({ id }).select('id', 'name', 'email', 'role').first();
    return user as User | undefined;
  },

  async create(input: CreateUserInput): Promise<User> {
    const db = getDatabase();
    const [newUser] = await db<DbUser>('users')
      .insert({
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role || 'user'
      })
      .returning(['id', 'name', 'email', 'role']);
    return newUser as User;
  },

  async update(id: number, input: UpdateUserInput): Promise<User | null> {
    const db = getDatabase();
    const updateData: Partial<DbUser> = {};
    if (input.name) updateData.name = input.name;
    if (input.email) updateData.email = input.email;

    const [updatedUser] = await db<DbUser>('users')
      .where({ id })
      .update(updateData)
      .returning(['id', 'name', 'email', 'role']);

    return (updatedUser as User) || null;
  },

  async delete(id: number): Promise<User | null> {
    const db = getDatabase();
    const [deletedUser] = await db<DbUser>('users')
      .where({ id })
      .del()
      .returning(['id', 'name', 'email', 'role']);

    return (deletedUser as User) || null;
  }
};
