import fs from 'fs/promises';
import path from 'path';
import type { ActionTask, EffortFeedback, PipelineResponse } from './schema';

export interface User计划Data {
  tasks: ActionTask[];
  completed_task_ids: string[];
  streak: { current: number; lastCompletedDate: string | null; best: number };
  mood_history: { date: string; mood: number }[];
  effort_feedback: EffortFeedback[];
  pipeline_result?: PipelineResponse | null;
}

export interface DbUser {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
}

export interface DbSchema {
  users: DbUser[];
  data: Record<string, User计划Data>;
}

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Helper to ensure database file exists
async function ensureDb(): Promise<DbSchema> {
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(raw) as DbSchema;
  } catch {
    // Database doesn't exist, create directory and default structure
    const dir = path.dirname(DB_FILE);
    await fs.mkdir(dir, { recursive: true });
    const defaultDb: DbSchema = { users: [], data: {} };
    await fs.writeFile(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
    return defaultDb;
  }
}

// Helper to save database state
async function saveDb(db: DbSchema): Promise<void> {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// User Queries
export async function getUserByUsername(username: string): Promise<DbUser | null> {
  const db = await ensureDb();
  const lower = username.toLowerCase().trim();
  return db.users.find((u) => u.username.toLowerCase() === lower) || null;
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const db = await ensureDb();
  return db.users.find((u) => u.id === id) || null;
}

export async function createUser(username: string, passwordHash: string, salt: string): Promise<DbUser> {
  const db = await ensureDb();
  const id = Math.random().toString(36).substring(2, 11);
  const newUser: DbUser = {
    id,
    username: username.trim(),
    passwordHash,
    salt,
  };
  
  db.users.push(newUser);
  db.data[id] = {
    tasks: [],
    completed_task_ids: [],
    streak: { current: 0, lastCompletedDate: null, best: 0 },
    mood_history: [],
    effort_feedback: [],
  };
  
  await saveDb(db);
  return newUser;
}

// User Data Sync Queries
export async function getUserPlanData(userId: string): Promise<User计划Data> {
  const db = await ensureDb();
  if (!db.data[userId]) {
    db.data[userId] = {
      tasks: [],
      completed_task_ids: [],
      streak: { current: 0, lastCompletedDate: null, best: 0 },
      mood_history: [],
      effort_feedback: [],
    };
    await saveDb(db);
  }
  return db.data[userId];
}

export async function syncUserPlanData(userId: string, data: Partial<User计划Data>): Promise<User计划Data> {
  const db = await ensureDb();
  if (!db.data[userId]) {
    db.data[userId] = {
      tasks: [],
      completed_task_ids: [],
      streak: { current: 0, lastCompletedDate: null, best: 0 },
      mood_history: [],
      effort_feedback: [],
    };
  }
  
  db.data[userId] = {
    ...db.data[userId],
    ...data,
  };
  
  await saveDb(db);
  return db.data[userId];
}
