import knex, { Knex } from 'knex';
import { databaseConfig } from './config';

let db: Knex | null = null;

export const initDatabase = async (): Promise<Knex> => {
  if (db) return db;

  db = knex(databaseConfig);

  try {
    await db.raw('SELECT 1');
    console.log('Database connection established');
  } catch (error) {
    throw new Error('Failed to connect to database');
  }

  return db;
};

export const getDatabase = (): Knex => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.destroy();
    db = null;
  }
};
