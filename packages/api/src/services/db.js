import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { ENV } from './env.service.js';

// Singleton promise to ensure we only open the DB once
let dbInstance = null;

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = open({
    filename: ENV.DB_FILE,
    driver: sqlite3.Database,
  });

  const db = await dbInstance;

  // Create the reservations table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    )
  `);

  return db;
}
