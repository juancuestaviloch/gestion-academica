import Database from 'better-sqlite3';
import { config } from '../config/index.js';

const db = new Database(config.dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function saveMessage(userId: number, role: string, content: string) {
  const stmt = db.prepare('INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)');
  stmt.run(userId, role, content);
}

export function getHistory(userId: number, limit: number = 20): Message[] {
  const stmt = db.prepare('SELECT role, content FROM messages WHERE user_id = ? ORDER BY created_at ASC LIMIT ?');
  const rows = stmt.all(userId, limit) as any[];
  return rows.map(row => ({ role: row.role, content: row.content }));
}

export default db;
