import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

let sqlite: Database.Database | null = null;
let db: any = null;

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), '.data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function getDatabase() {
  if (!sqlite) {
    ensureDataDirectory();
    const dbPath = path.join(process.cwd(), '.data', 'pijam.db');
    sqlite = new Database(dbPath);
    sqlite.pragma('foreign_keys = ON');
    db = drizzle(sqlite, { schema });
    initializeDatabase();
  }
  return db;
}

export function getDb() {
  return getDatabase();
}

// Create tables if they don't exist
function initializeDatabase() {
  if (!sqlite) return;

  const createTableStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      role TEXT NOT NULL,
      school_name TEXT,
      display_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      team_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS student_teams (
      id TEXT PRIMARY KEY,
      pin TEXT NOT NULL,
      name TEXT NOT NULL,
      school_name TEXT NOT NULL,
      member_names TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      school_name TEXT NOT NULL,
      title TEXT NOT NULL,
      theme TEXT NOT NULL,
      team_id TEXT,
      student_team TEXT NOT NULL,
      problem_statement TEXT NOT NULL,
      target_audience TEXT NOT NULL,
      status TEXT NOT NULL,
      last_updated TEXT NOT NULL,
      stage_data TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS timeline_events (
      id TEXT PRIMARY KEY,
      idea_id TEXT NOT NULL,
      type TEXT NOT NULL,
      stage TEXT,
      from_stage TEXT,
      to_stage TEXT,
      content TEXT,
      author TEXT,
      timestamp TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS theme_activities (
      id TEXT PRIMARY KEY,
      date INTEGER NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      theme TEXT NOT NULL,
      school_name TEXT,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  createTableStatements.forEach((sql) => {
    sqlite!.exec(sql);
  });
}
