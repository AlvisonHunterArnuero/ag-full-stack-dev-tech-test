import bcrypt from 'bcrypt';
import { DbUser, CreateUserInput, LoginInput } from '../types/user';
import { getDatabase } from '../database/connection';
import { generateToken } from '../auth/utils';

const SALT_ROUNDS = 10;

export const authController = {
  async register(input: CreateUserInput): Promise<{ user: Omit<DbUser, 'password'>; token: string }> {
    const db = getDatabase();

    const existingUser = await db<DbUser>('users').where({ email: input.email }).first();
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const [newUser] = await db<DbUser>('users')
      .insert({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role ?? 'user',
      })
      .returning(['id', 'name', 'email', 'role', 'created_at']);

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    const userWithoutPassword = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      created_at: newUser.created_at,
    };

    return { user: userWithoutPassword, token };
  },

  async login(input: LoginInput): Promise<{ user: Omit<DbUser, 'password'>; token: string }> {
    const db = getDatabase();

    const user = await db<DbUser>('users').where({ email: input.email }).first();
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    return { user: userWithoutPassword, token };
  },
};
