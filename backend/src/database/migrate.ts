import knex from 'knex';
import { databaseConfig } from './config';

export const runMigrations = async (): Promise<void> => {
  const db = knex(databaseConfig);

  try {
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations completed.');
  } finally {
    await db.destroy();
  }
};
